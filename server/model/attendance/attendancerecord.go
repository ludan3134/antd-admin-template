package attendance

import "gorm.io/gorm"

type AttendanceRecord struct {
	Id           int            `json:"id" gorm:"index;comment:员工ID"`
	EmployNum    string         `json:"employNum" gorm:"comment:员工编号"`      // 员工编号
	Name         string         `json:"name" gorm:"index;comment:员工名称"`     // 用户名称
	Machine      string         `json:"machine" gorm:"comment:机器号"`         // 打卡机器号
	Date         string         `json:"date" gorm:"comment:打卡日期"`           // 用户头像
	ClockInTime  string         `json:"clockInTime" gorm:"comment:上班打卡时间"`  // 上班打卡时间
	ClockOutTime string         `json:"clockOutTime" gorm:"comment:下班打卡时间"` // 上班打卡时间
	DeletedAt    gorm.DeletedAt //是否删除
}

func (AttendanceRecord) TableName() string {
	return "attendance_record"
}
