package system

import (
	"github.com/gin-gonic/gin"
	v1 "server/api/v1"
)

type BaseRouter struct{}

func (s *BaseRouter) InitBaseRouter(Router *gin.RouterGroup) (R gin.IRoutes) {
	baseRouter := Router.Group("base")
	baseApi := v1.ApiGroupApp.SystemApiGroup.BaseApi
	{
		baseRouter.POST("register", baseApi.Register)      // 注册用户
		baseRouter.POST("login", baseApi.Login)            // 登录
		baseRouter.GET("getUserInfo", baseApi.GetUserInfo) // 登录获取用户信息
		baseRouter.POST("logout", baseApi.Logout)          // 登录获取用户信息
	}
	return baseRouter
}
