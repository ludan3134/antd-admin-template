package system

import (
	"github.com/gin-gonic/gin"
	v1 "server/api/v1"
)

type CabinRouter struct{}

func (s *UserRouter) InitCabinRouter(Router *gin.RouterGroup) {
	cabinRouter := Router.Group("cabin")
	cabinApi := v1.ApiGroupApp.SystemApiGroup.SysCabinApi
	{
		cabinRouter.POST("getCabinList", cabinApi.GetCabinList) // 分页获取权限列表
		cabinRouter.POST("upsetCabin", cabinApi.UpsetCabin)     // 更新权限
		cabinRouter.POST("deleteCabin", cabinApi.DeleteCabin)   // 根据用户获取角色列表
	}
}
