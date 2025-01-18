package system

type ServiceGroup struct {
	JwtService
	UserService
	CabinService
	MenuService
	SysRoleService
	SysDeptService
}
