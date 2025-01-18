package attendance

import (
	"gorm.io/gorm"
	"server/model/common/request"
)

type AttendanceDate struct {
	Id           int                 `json:"id" gorm:"index;comment:ID"`
	Date         string              `json:"date" gorm:"comment:日期"`
	IsOnWork     bool                `json:"IsOnWork" gorm:"comment:是否正常上班"`
	ClickInTime  request.SliceString `json:"clickInTime" gorm:"type:json"` // 上班打卡时间
	ClickOutTime request.SliceString `json:"clickOutTime" gorm:"type:json"`
	DeletedAt    gorm.DeletedAt      //是否删除
}

func (AttendanceDate) TableName() string {
	return "attendance_date"
}
