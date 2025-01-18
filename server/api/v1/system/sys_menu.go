package system

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"server/global"
	"server/model/common/request"
	"server/model/common/response"
	"server/model/system"
	request2 "server/model/system/request"
	systemRes "server/model/system/response"
	"server/utils"
)

type MenuApi struct{}

type RequestBody struct {
	RoleId  int64   `json:"roleId"`
	MenuIds []int64 `json:"menuIds"`
}

// 1-->获取菜单树
func (a *MenuApi) GetMenu(c *gin.Context) {
	menus, err := menuService.GetMenuTree(utils.GetUserAuthorityId(c))
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	if menus == nil {
		menus = []system.SysMenu{}
	}
	response.OkWithDetailed(systemRes.SysMenusResponse{Menus: menus}, "获取成功", c)
}

// 2-->新增菜单树
func (a *MenuApi) AddMenu(c *gin.Context) {
	var menu system.SysMenu
	err := c.ShouldBindJSON(&menu)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	//err = utils.Verify(menu, utils.MenuVerify)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	//err = utils.Verify(menu.Meta, utils.MenuMetaVerify)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = menuService.AddMenu(menu)
	if err != nil {
		global.GVA_LOG.Error("添加失败!", zap.Error(err))
		response.FailWithMessage("添加失败", c)
		return
	}
	response.OkWithMessage("添加成功", c)
}

// 3--->获取角色菜单树
func (a *MenuApi) GetMenuByRoleId(c *gin.Context) {
	var RoleId request2.GetMenuByRoId
	err2 := c.ShouldBindJSON(&RoleId)
	if err2 != nil {
		response.FailWithMessage(err2.Error(), c)
		return
	}
	menus, ids, sum, err := menuService.GetMenuByRoleId(RoleId.RoleId)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithDetailed(systemRes.SysMenusResponse{Menus: nil}, "获取失败", c)
		return
	}
	response.OkWithDetailed(gin.H{
		"menuTree": menus,
		"menuIds":  ids,
		"total":    sum,
	}, "获取成功", c)
}

// 删除菜单
func (a *MenuApi) DeleteMenu(c *gin.Context) {
	var menu request.GetByIds
	err := c.ShouldBindJSON(&menu)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	//err = utils.Verify(menu, utils.IdVerify)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = menuService.DeleteMenu(menu.IDs[0])
	if err != nil {
		global.GVA_LOG.Error("删除失败!", zap.Error(err))
		response.FailWithMessage("删除失败,该菜单可能存在子菜单", c)
		return
	}
	response.OkWithMessage("删除成功", c)
}

// 更新菜单
func (a *MenuApi) UpdateMenu(c *gin.Context) {
	var menu system.SysMenu
	err := c.ShouldBindJSON(&menu)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = menuService.UpdateMenu(menu)
	if err != nil {
		global.GVA_LOG.Error("更新失败!", zap.Error(err))
		response.FailWithMessage("更新失败", c)
		return
	}
	response.OkWithMessage("更新成功", c)
}

func (a *MenuApi) GetMenuList(c *gin.Context) {
	var menuFilter request2.SysMenusFilter
	err2 := c.ShouldBindJSON(&menuFilter)
	if err2 != nil {
		return
	}
	menuList, total, err := menuService.GetAllMenuList()
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}

	response.OkWithDetailed(response.PageResult{
		List:  menuList,
		Total: total,
	}, "获取成功", c)
}

// 为角色分配权限
func (a *MenuApi) SetRoleMenu(c *gin.Context) {
	var req RequestBody
	c.ShouldBindJSON(&req)

	if err := menuService.SetRoleMenu(req.RoleId, req.MenuIds); err != nil {
		global.GVA_LOG.Error("添加失败!", zap.Error(err))
		response.FailWithMessage("添加失败", c)
	} else {
		response.OkWithMessage("添加成功", c)
	}
}
