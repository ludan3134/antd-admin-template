package system

import (
	"errors"
	"fmt"
	"gorm.io/gorm/clause"
	"server/global"
	"server/model/common/request"
	"server/model/system"
	systemReq "server/model/system/request"
)

var ErrRoleExistence = errors.New("存在相同角色id")

type SysRoleService struct{}

var SysRoleServiceApp = new(SysRoleService)

func (SysRoleService *SysRoleService) GetRoleList(info request.PageInfo) (list interface{}, total int64, err error) {
	limit := info.Limit
	offset := info.Limit * (info.Page - 1)
	db := global.GVA_DB.Model(&system.SysRole{})
	name := info.Name
	if len(name) != 0 {
		db.Where("name LIKE ?", "%"+name+"%")
	}
	var roleList []system.SysRole
	err = db.Count(&total).Error
	if err != nil {
		return
	}
	fmt.Println("offset", offset)
	err = db.Limit(limit).Offset(offset).Find(&roleList).Error
	return roleList, total, err
}

// 分配用户角色
func (SysRoleService *SysRoleService) UpsetRole(params system.SysRole) error {
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	fmt.Println("params.Enable", params.Status)
	// 尝试创建或更新记录
	result := tx.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"name", "over_view", "status"}),
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
func (SysRoleService *SysRoleService) DeleteRole(params request.DeleteIds) error {
	// 开始事务
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// 尝试创建或更新记录
	// 检查是否有与要删除的角色关联的用户
	var userRoles []systemReq.SysUserRoles
	if err := tx.Where("sys_role_id IN (?)", params.Ids).Find(&userRoles).Error; err != nil {
		tx.Rollback() // 如果有错误，回滚事务
		return err
	}

	// 如果找到关联的用户，则禁止删除
	if len(userRoles) > 0 {
		tx.Rollback() // 有用户关联，回滚事务
		return errors.New("角色已被用户使用，无法删除")
	}
	// 如果没有关联的用户，则执行删除操作
	if err := tx.Where("id IN (?)", params.Ids).Delete(&system.SysRole{}).Error; err != nil {
		tx.Rollback() // 如果有错误，回滚事务
		return err
	}
	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}
