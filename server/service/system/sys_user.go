package system

import (
	"errors"
	"fmt"
	"github.com/gofrs/uuid/v5"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"log"
	"server/global"
	"server/model/common/request"
	"server/model/system"
	systemReq "server/model/system/request"
	"server/utils"
)

type UserService struct{}

// 注册
func (userService *UserService) Register(u system.SysUser) (userInter system.SysUser, err error) {
	var user system.SysUser
	if !errors.Is(global.GVA_DB.Where("username = ?", u.Username).First(&user).Error, gorm.ErrRecordNotFound) { // 判断用户名是否注册
		return userInter, errors.New("用户名已注册")
	}
	// 否则 附加uuid 密码hash加密 注册
	u.Password = utils.BcryptHash(u.Password)
	u.UUID = uuid.Must(uuid.NewV4())
	err = global.GVA_DB.Create(&u).Error
	return u, err
}

// 登录
func (userService *UserService) Login(u *system.SysUser) (userInter *system.SysUser, roleIds []uint, err error) {
	if nil == global.GVA_DB {
		return nil, nil, fmt.Errorf("db not init")
	}
	var user system.SysUser
	err = global.GVA_DB.Where("username = ?", u.Username).First(&user).Error
	if err == nil {
		if ok := utils.BcryptCheck(u.Password, user.Password); !ok {
			return nil, nil, errors.New("密码错误")
		}
	}

	var userRoles []systemReq.SysUserRoles
	global.GVA_DB.Where("sys_user_id = ?", user.ID).Find(&userRoles)
	for _, role := range userRoles {
		roleIds = append(roleIds, role.SysRoleID)
	}

	return &user, roleIds, err
}

// 获取用户列表信息
func (userService *UserService) GetUserList(info request.PageInfo) (list interface{}, total int64, err error) {
	limit := info.Limit
	offset := info.Limit * (info.Page - 1)
	id := info.DeptId
	name := info.Name
	db := global.GVA_DB.Model(&system.SysUser{})
	if len(id) != 0 {
		db.Where("dept_id = ?", id)
	}
	if len(name) != 0 {
		db.Where("username LIKE ?", "%"+name+"%")
	}
	var userList []system.SysUser
	err = db.Count(&total).Error
	if err != nil {
		return
	}
	err = db.Joins("left join sys_dept on sys_user.dept_id = sys_dept.id").
		Preload("Roles").
		Limit(limit).Offset(offset).
		Select("sys_user.*, sys_dept.name as dept_name").
		Find(&userList).Error
	return userList, total, err
}

// 根据用户获取角色
func (userService *UserService) GetRolesByUser(params systemReq.GetRolesByUser) (list interface{}, err error) {
	var roleList []system.SysRole
	id := params.UserId
	var userRoles []systemReq.SysUserRoles
	tx := global.GVA_DB.Begin()
	if err := tx.Where("sys_user_id = ?", id).Find(&userRoles).Error; err != nil {
		tx.Rollback() // 回滚事务
		return nil, err
	}
	var roleIds []uint
	for _, role := range userRoles {
		roleIds = append(roleIds, role.SysRoleID)
	}
	// 如果status为1，则查询用户的角色
	if params.Status == "1" {
		if err := tx.Where("id  IN (?)", roleIds).Find(&roleList).Error; err != nil {
			tx.Rollback() // 回滚事务
			return nil, err
		}
	} else if params.Status == "0" {
		if roleIds == nil || len(roleIds) == 0 {
			if err := tx.Find(&roleList).Error; err != nil {
				tx.Rollback() // 回滚事务
				return nil, err
			}
		} else {
			if err := tx.Where("id NOT IN (?)", roleIds).Find(&roleList).Error; err != nil {
				tx.Rollback() // 回滚事务
				return nil, err
			}
		}
	} else {
		// 如果status不是1或0，则返回错误
		err = errors.New("status must be '1' or '0'")
		return
	}

	// 根据角色ID查询所有相关的角色信息

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		tx.Rollback() // 回滚事务
		return nil, err
	}

	return roleList, nil
}

// 分配用户角色
func (userService *UserService) UpsetUser(params system.SysUser) error {
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	fmt.Println("params.Enable", params.Enable)
	// 尝试创建或更新记录
	result := tx.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"username", "password", "header_img", "phone", "email", "enable", "dept_id"}),
	}).Create(&params)

	// 检查创建或更新操作是否成功
	if result.Error != nil {
		tx.Rollback() // 回滚事务，因为创建或更新失败了
		return result.Error
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

// 分配用户角色
func (userService *UserService) AssignRole(params systemReq.AssignRole) error {
	db := global.GVA_DB
	tx := db.Begin()

	if tx.Error != nil {
		return tx.Error
	}

	// 删除用户现有的所有角色关联
	if err := tx.Delete(systemReq.SysUserRoles{}, "sys_user_id = ?", params.Id).Error; err != nil {
		tx.Rollback() // 回滚事务
		return err
	}

	// 为用户分配新的角色
	for _, roleIdStr := range params.RoleIds {

		userRole := systemReq.SysUserRoles{
			SysUserId: uint(params.Id),
			SysRoleID: uint(roleIdStr),
		}
		fmt.Println("userRole", userRole)
		if err := tx.Create(&userRole).Error; err != nil {
			tx.Rollback() // 回滚事务
			return err
		}
	}
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

// 删除用户
func (userService *UserService) DeleteUser(params request.DeleteIds) error {
	// 开始事务
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	// 尝试创建或更新记录

	// 检查是否有与要删除的角色关联的用户
	var userRoles []systemReq.SysUserRoles
	if err := tx.Where("sys_user_id IN (?)", params.Ids).First(&userRoles).Error; err != nil {
		log.Println("所选角色无关联用户,可删除")
		// 如果没有关联的用户，则执行删除操作
		if err = tx.Where("id IN (?)", params.Ids).Delete(&system.SysUser{}).Error; err != nil {
			tx.Rollback() // 如果有错误，回滚事务
			return err
		}
	}
	// 如果找到关联的用户，则禁止删除
	if len(userRoles) > 0 {
		tx.Rollback() // 有用户关联，回滚事务
		return errors.New("用户已有角色，无法删除")
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (userService *UserService) SetSelfInfo(req system.SysUser) error {
	return global.GVA_DB.Model(&system.SysUser{}).
		Where("id=?", req.ID).
		Updates(req).Error
}

func (userService *UserService) GetUserInfo(uuid uuid.UUID) (user system.SysUser, err error) {
	//上次组局的事情让我明白了,自己辛苦组喊人垫钱预定场地,花了很多精力,但还是很少人响应.结果换成帮其他大群组织者帮忙,再自己收点劳务费,还不用自己那么麻烦.毕竟人家资源多.
	var reqUser system.SysUser
	err = global.GVA_DB.Preload("Roles").First(&reqUser, "uuid = ?", uuid).Error
	if err != nil {
		return reqUser, err
	}
	//MenuServiceApp.UserAuthorityDefaultRouter(&reqUser)
	return reqUser, err
}

func (userService *UserService) FindUserById(id int) (user *system.SysUser, err error) {
	var u system.SysUser
	err = global.GVA_DB.Where("id = ?", id).First(&u).Error
	return &u, err
}

func (userService *UserService) FindUserByUuid(uuid string) (user *system.SysUser, err error) {
	var u system.SysUser
	if err = global.GVA_DB.Where("uuid = ?", uuid).First(&u).Error; err != nil {
		return &u, errors.New("用户不存在")
	}
	return &u, nil
}

func (userService *UserService) ResetPassword(param systemReq.ResetPassword) (err error) {
	Password := utils.BcryptHash("12345678")
	err = global.GVA_DB.Model(&system.SysUser{}).Where("id = ?", param.Id).Update("password", Password).Error
	return err
}
