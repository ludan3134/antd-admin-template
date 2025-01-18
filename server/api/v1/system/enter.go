package system

import (
	"server/service"
)

type ApiGroup struct {
	BaseApi
	MenuApi
	SysRoleApi
	SysUserApi
	SysDeptApi
	SysCabinApi
}

var (
	userService      = service.ServiceGroupApp.SystemServiceGroup.UserService
	jwtService       = service.ServiceGroupApp.SystemServiceGroup.JwtService
	menuService      = service.ServiceGroupApp.SystemServiceGroup.MenuService
	authorityService = service.ServiceGroupApp.SystemServiceGroup.SysRoleService
	deptService      = service.ServiceGroupApp.SystemServiceGroup.SysDeptService
	cabinService     = service.ServiceGroupApp.SystemServiceGroup.CabinService
)
