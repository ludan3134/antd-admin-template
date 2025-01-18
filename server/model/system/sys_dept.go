package system

import (
	"server/model/common/request"
)

type SysDeptForList struct {
	Id           string              `json:"id" gorm:"index;comment:部门ID"`              // 用户UUID
	Name         string              `json:"name" gorm:"index;comment:部门名称"`            // 用户登录名
	Overview     string              `json:"overview" gorm:"default:部门简介;comment:部门简介"` // 部门简介
	Total        uint                `json:"total" gorm:"0;comment:用户总人数"`              // 用户头像
	ClickInTime  request.SliceString `json:"clickInTime" gorm:"type:json"`              // 上班打卡时间
	ClickOutTime request.SliceString `json:"clickOutTime" gorm:"type:json"`
}
type SysDept struct {
	Id           int                 `json:"id" gorm:"index;comment:部门ID"`              // 用户UUID
	Name         string              `json:"name" gorm:"index;comment:部门名称"`            // 用户登录名
	Overview     string              `json:"overview" gorm:"default:部门简介;comment:部门简介"` // 部门简介
	ClickInTime  request.SliceString `json:"clickInTime" gorm:"type:json"`              // 上班打卡时间
	ClickOutTime request.SliceString `json:"clickOutTime" gorm:"type:json"`
}

func (SysDept) TableName() string {
	return "sys_dept"
}
