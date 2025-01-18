package system

import (
	"errors"
	"gorm.io/gorm/clause"
	"log"
	"server/global"
	"server/model/common/request"
	"server/model/system"
)

type SysDeptService struct{}

// 注册
func (deptService *SysDeptService) GetDeptList(info request.PageInfo) (deptlist []system.SysDeptForList, err error) {
	limit := info.Limit
	offset := info.Limit * (info.Page - 1)
	db := global.GVA_DB.Model(&system.SysDept{})
	name := info.Name
	if len(name) != 0 {
		db.Where("name LIKE ?", "%"+name+"%")
	}

	err = db.Joins("LEFT JOIN sys_user on sys_user.dept_id = sys_dept.id").
		Where("sys_user.deleted_at is NULL"). // 添加条件排除被删除的用户
		Group("sys_dept.id").
		Select("sys_dept.*,Count(sys_user.id) as total").
		Offset(offset).
		Limit(limit).
		Scan(&deptlist).Error

	if err != nil {
		return nil, err
	}
	return deptlist, err
}

// 分配用户角色
func (deptService *SysDeptService) UpsetDept(params system.SysDept) error {
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	// 尝试创建或更新记录
	result := tx.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"name", "overview", "click_in_time", "click_out_time"}),
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

// 删除部门
func (deptService *SysDeptService) DeleteDept(params request.DeleteIds) error {
	// 开始事务
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	// 尝试创建或更新记录

	// 检查是否有与要删除的角色关联的用户
	var user []system.SysUser
	if err := tx.Where("dept_id IN (?)", params.Ids).First(&user).Error; err != nil {
		log.Println("所选部门下没有下级员工,可删除")
		if err = tx.Where("id IN (?)", params.Ids).Delete(&system.SysDept{}).Error; err != nil {
			tx.Rollback() // 如果有错误，回滚事务
			return err
		}
	}
	// 如果找到关联的用户，则禁止删除
	if len(user) > 0 {
		tx.Rollback() // 有用户关联，回滚事务
		return errors.New("该部门已有员工，无法删除")
	}
	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}
