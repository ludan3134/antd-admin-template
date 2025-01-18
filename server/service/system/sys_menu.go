package system

import (
	"errors"
	"gorm.io/gorm"
	"server/global"
	"server/model/system"
	"server/model/system/request"
	"strconv"
)

type MenuService struct{}

var MenuServiceApp = new(MenuService)

// 1-->获取动态菜单树
func (menuService *MenuService) getMenuTreeMap(roleID []uint) (treeMap map[uint][]system.SysMenu, err error) {
	var allMenus []system.SysMenu
	var buttonMenus []system.SysMenu
	treeMap = make(map[uint][]system.SysMenu)
	//获取到角色菜单数组
	var roleMenus []request.SysRoleMenus
	err = global.GVA_DB.Where("sys_role_id IN ?", roleID).Find(&roleMenus).Error
	if err != nil {
		return nil, err
	}
	//获取到menuIds
	var menuIds []int64
	for _, roleMenu := range roleMenus {
		menuIds = append(menuIds, roleMenu.SysMenuID)
	}
	// 填充allmenus
	err = global.GVA_DB.Where("id IN ? AND menu_type != ?", menuIds, "button").Find(&allMenus).Error
	if err != nil {
		return nil, err
	}
	// 填充buttonMenus
	err = global.GVA_DB.Where("id IN ? AND menu_type = ?", menuIds, "button").Find(&buttonMenus).Error
	if err != nil {
		return nil, err
	}
	btnMap := make(map[uint][]string)
	for _, v := range buttonMenus {
		btnMap[v.ParentID] = append(btnMap[v.ParentID], v.Code)
	}
	for _, v := range allMenus {
		v.Buttons = btnMap[v.Id]
		treeMap[v.ParentID] = append(treeMap[v.ParentID], v)
	}
	return treeMap, err
}
func (menuService *MenuService) getChildrenList(menu *system.SysMenu, treeMap map[uint][]system.SysMenu) (err error) {
	menu.Children = treeMap[menu.Id]
	for i := 0; i < len(menu.Children); i++ {
		err = menuService.getChildrenList(&menu.Children[i], treeMap)
	}
	return err
}
func (menuService *MenuService) GetMenuTree(roleID []uint) (menus []system.SysMenu, err error) {
	menuTree, err := menuService.getMenuTreeMap(roleID)
	menus = menuTree[0]
	for i := 0; i < len(menus); i++ {
		err = menuService.getChildrenList(&menus[i], menuTree)
	}
	return menus, err
}

// 2-->更新菜单
func (menuService *MenuService) UpdateMenu(menu system.SysMenu) (err error) {
	return err
}

// 2-->删除菜单
func (menuService *MenuService) DeleteMenu(id int) (err error) {
	err = global.GVA_DB.First(&system.SysMenu{}, "parent_id = ?", id).Error
	if err != nil {
		return global.GVA_DB.Transaction(func(tx *gorm.DB) error {
			err = tx.Delete(&system.SysMenu{}, "id = ?", id).Error
			if err != nil {
				return err
			}
			sql := "DELETE FROM sys_role_menus WHERE menu_id = ?"
			tx.Exec(sql, id)
			return nil
		})
	}
	return errors.New("此菜单存在子菜单不可删除")
}

// 3-->新增菜单
func (menuService *MenuService) AddMenu(menu system.SysMenu) error {
	if !errors.Is(global.GVA_DB.Where("title = ?", menu.Title).First(&system.SysMenu{}).Error, gorm.ErrRecordNotFound) {
		return errors.New("存在重复name，请修改name")
	}
	return global.GVA_DB.Create(&menu).Error
}

// 4--->分页查询路由
func (menuService *MenuService) getAllMenuTreeMap() (treeMap map[uint][]system.SysMenu, err error) {
	var allMenus []system.SysMenu
	treeMap = make(map[uint][]system.SysMenu)
	err = global.GVA_DB.Order("sort").Preload("MenuBtn").Preload("Parameters").Find(&allMenus).Error
	for _, v := range allMenus {
		treeMap[v.ParentID] = append(treeMap[v.ParentID], v)
	}
	return treeMap, err
}
func (menuService *MenuService) getAllChildrenList(menu *system.SysMenu, treeMap map[uint][]system.SysMenu) (err error) {
	menu.Children = treeMap[menu.Id]
	for i := 0; i < len(menu.Children); i++ {
		err = menuService.getAllChildrenList(&menu.Children[i], treeMap)
	}
	return err
}
func (menuService *MenuService) GetAllMenuList() (list interface{}, total int64, err error) {
	var menuList []system.SysMenu
	treeMap, err := menuService.getAllMenuTreeMap()
	menuList = treeMap[0]
	for i := 0; i < len(menuList); i++ {
		err = menuService.getAllChildrenList(&menuList[i], treeMap)
	}
	// 获取 menuList 的长度
	menuListLength := len(menuList)
	return menuList, int64(menuListLength), err
}

// 5-->根据角色获取菜单
func (menuService *MenuService) GetMenuByRoleId(rolId int) (list interface{}, menuIds []string, sum int64, err error) {
	var sysRole system.SysRole
	var sysRoleMenu []system.SysMenu
	list, t, err := menuService.GetAllMenuList()
	if err != nil {
		return
	}
	err = global.GVA_DB.Preload("Menus").First(&sysRole, "id = ?", rolId).Error
	if err != nil {
		return
	}
	sysRoleMenu = sysRole.Menus
	var ids []string
	for i := range sysRoleMenu {
		ids = append(ids, strconv.FormatUint(uint64(sysRoleMenu[i].Id), 10))
	}

	return list, ids, t, err
}

// 6-->为角色添加菜单
func (menuService *MenuService) SetRoleMenu(roleId int64, menuIds []int64) (err error) {
	db := global.GVA_DB

	// 开始事务
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// 批量删除旧的菜单权限
	// 删除与指定角色 ID 相关联的所有菜单权限
	err = tx.Model(&request.SysRoleMenus{}).Where("sys_role_id = ?", roleId).Delete(&request.SysRoleMenus{}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	// 准备要添加的数据
	to := make([]request.SysRoleMenus, 0, len(menuIds))
	for _, menuID := range menuIds {
		to = append(to, request.SysRoleMenus{
			SysRoleID: roleId,
			SysMenuID: menuID,
		})
	}
	// 批量插入新的菜单权限
	err = tx.Create(&to).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	// 提交事务
	return tx.Commit().Error
}
