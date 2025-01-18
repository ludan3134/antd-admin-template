package system

type SysMenu struct {
	Id          uint      `json:"id" gorm:"comment:菜单ID"`
	Code        string    `json:"code" gorm:"index;comment:菜单编码"`
	Title       string    `json:"title" gorm:"default:菜单简介;comment:菜单名称"`
	ParentID    uint      `json:"parentId" gorm:"default:0;comment:父级ID"`
	ParentTitle string    `json:"parentTitle" gorm:"comment:父级菜单名称"`
	MenuType    string    `json:"menuType" gorm:"default:menu;comment:菜单类型"` // 可以是 'menu', 'button', 'catalog' 等
	Component   string    `json:"component" gorm:"comment:组件路径"`
	Icon        string    `json:"icon" gorm:"comment:菜单图标"`
	Sort        uint      `json:"sort" gorm:"comment:排序"`
	Hidden      bool      `json:"hidden" gorm:"comment:是否隐藏"`
	Level       uint      `json:"level" gorm:"comment:层级"`
	Children    []SysMenu `json:"children" gorm:"-"` // 表示嵌套关系，不需要在数据库中存储
	Buttons     []string  `json:"buttons" gorm:"-"`
}

func (SysMenu) TableName() string {
	return "sys_menu"
}
