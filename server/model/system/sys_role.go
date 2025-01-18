package system

type SysRole struct {
	Id       uint      `json:"id" gorm:"index;comment:角色UUID"` // 角色UUID
	Name     string    `json:"name" gorm:"index;comment:角色名"`  // 角色登录名
	Menus    []SysMenu `json:"menu" gorm:"many2many:sys_role_menus;"`
	OverView string    `json:"overview"  gorm:"comment:角色简介"` // 简介
	Status   uint      `json:"status" gorm:"comment:角色状态"`    //状态
}

func (SysRole) TableName() string {
	return "sys_role"
}
