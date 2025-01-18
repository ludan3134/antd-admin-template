package system

import (
	"github.com/gin-gonic/gin"
	v1 "server/api/v1"
)

type UserRouter struct{}

func (s *UserRouter) InitUserRouter(Router *gin.RouterGroup) {
	userRouter := Router.Group("user")
	userApi := v1.ApiGroupApp.SystemApiGroup.SysUserApi
	{
		userRouter.POST("getUserList", userApi.GetUserList)       // 分页获取用户列表
		userRouter.POST("getRolesByUser", userApi.GetRolesByUser) // 根据用户获取角色列表
		userRouter.POST("assignRole", userApi.AssignRole)         // 根据用户获取角色列表
		userRouter.POST("UpsetUser", userApi.UpsetUser)           // 	更新角色
		userRouter.POST("deleteUser", userApi.DeleteUser)         // 删除角色
		userRouter.POST("resetPassword", userApi.ResetPassword)   // 删除角色
	}
}
