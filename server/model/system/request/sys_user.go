package request

// 注册
type Register struct {
	Username  string `json:"userName" example:"用户名"`
	Password  string `json:"passWord" example:"密码"`
	HeaderImg string `json:"headerImg" example:"头像链接"`
	Enable    int    `json:"enable" swaggertype:"string" example:"int 是否启用"`
	Phone     string `json:"phone" example:"电话号码"`
	Email     string `json:"email" example:"电子邮箱"`
}

// 登录
type Login struct {
	Username string `json:"username"` // 用户名
	Password string `json:"password"` // 密码
}

// 登录
type ResetPassword struct {
	Id uint `json:"id"` // 用户id
}

// 登录
type SyUserFilter struct {
	Username string `json:"userName" form:"userName"` // 用户名
	DeptId   int    `json:"deptId" form:"deptId"`
}

// 根据用户获取角色信息
type GetRolesByUser struct {
	UserId uint   `json:"userId" gorm:"primarykey"`  // 主键ID
	Status string `json:"status"  gorm:"comment:状态"` // 用户手机号
}

// 根据用户分配角色
type AssignRole struct {
	Id      int   `json:"id" gorm:"primarykey"`          // 用户ID
	RoleIds []int `json:"roleIds" gorm:"comment:角色ID列表"` // 角色ID列表
}

// 用户角色中间表
type SysUserRoles struct {
	SysUserId uint `gorm:"primaryKey;column:sys_user_id"`
	SysRoleID uint `gorm:"primaryKey;column:sys_role_id"`
}
