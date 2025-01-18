package system

import (
	"github.com/gin-gonic/gin"
	v1 "server/api/v1"
)

type AuthorityRouter struct{}

func (s *AuthorityRouter) InitSysRoleRouter(Router *gin.RouterGroup) {
	SysRoleRouterWithoutRecord := Router.Group("role")
	sysRoleApi := v1.ApiGroupApp.SystemApiGroup.SysRoleApi
	{
		SysRoleRouterWithoutRecord.POST("getRoleList", sysRoleApi.GetRoleList) // 获取角色列表
		SysRoleRouterWithoutRecord.POST("upsetRole", sysRoleApi.UpsetRole)     // 获取角色列表
		SysRoleRouterWithoutRecord.POST("deleteRole", sysRoleApi.DeleteRole)   // 获取角色列表
	}
}
