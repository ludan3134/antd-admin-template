package system

import (
	"github.com/gin-gonic/gin"
	v1 "server/api/v1"
)

type MenuRouter struct{}

func (s *MenuRouter) InitMenuRouter(Router *gin.RouterGroup) (R gin.IRoutes) {
	menuRouterWithoutRecord := Router.Group("menu")
	MenuApi := v1.ApiGroupApp.SystemApiGroup.MenuApi
	{
		menuRouterWithoutRecord.GET("getMenu", MenuApi.GetMenu)                  //获取用户角色菜单
		menuRouterWithoutRecord.POST("getMenuList", MenuApi.GetMenuList)         // 获取菜单树
		menuRouterWithoutRecord.POST("addMenu", MenuApi.AddMenu)                 // 新增菜单
		menuRouterWithoutRecord.POST("updateMenu", MenuApi.UpdateMenu)           // 更新菜单
		menuRouterWithoutRecord.POST("deleteMenu", MenuApi.DeleteMenu)           // 更新菜单
		menuRouterWithoutRecord.POST("getMenuByRoleId", MenuApi.GetMenuByRoleId) // 根据角色获取菜单
		menuRouterWithoutRecord.POST("setRoleMenu", MenuApi.SetRoleMenu)         // 为角色分配菜单权限
	}
	return menuRouterWithoutRecord
}
