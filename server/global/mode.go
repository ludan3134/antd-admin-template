package global

import (
	"gorm.io/gorm"
	"time"
)

type GVA_MODEL struct {
	ID        uint      `gorm:"primarykey" json:"ID"` // 主键ID
	CreatedAt time.Time //创建时间
	UpdatedAt time.Time //更新时间
	DeletedAt gorm.DeletedAt
}
