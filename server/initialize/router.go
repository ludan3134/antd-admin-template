package initialize

import (
	"github.com/gin-gonic/gin"
	"server/global"
	"server/router"
)

// 初始化总路由
func Routers() *gin.Engine {
	Router := gin.New()
	Router.Use(gin.Recovery())
	if gin.Mode() == gin.DebugMode {
		Router.Use(gin.Logger())
	}
	systemRouter := router.RouterGroupApp.System
	attendanceRouter := router.RouterGroupApp.Attendance

	PublicGroup := Router.Group(global.GVA_CONFIG.System.RouterPrefix)
	{
		systemRouter.InitBaseRouter(PublicGroup) // 注册基础功能路由 不做鉴权
	}
	PrivateGroup := Router.Group(global.GVA_CONFIG.System.RouterPrefix)
	//PrivateGroup.Use(middleware.JWTAuth()).Use(middleware.CasbinHandler())
	{
		systemRouter.InitUserRouter(PrivateGroup)    // 注册用户路由
		systemRouter.InitMenuRouter(PrivateGroup)    // 注册权限路由
		systemRouter.InitSysRoleRouter(PrivateGroup) // 角色路由
		systemRouter.InitDeptRouter(PrivateGroup)    //部门路由
		systemRouter.InitCabinRouter(PrivateGroup)   //权限路由
	}
	{
		attendanceRouter.InitAttendanceRouter(PrivateGroup) // 注册用户路由
	}
	global.GVA_LOG.Info("router register success")
	return Router
}
