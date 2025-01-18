package system

import (
	"github.com/gin-gonic/gin"
	v1 "server/api/v1"
)

type DeptRouter struct{}

func (s *MenuRouter) InitDeptRouter(Router *gin.RouterGroup) (R gin.IRoutes) {
	deptRouterWithoutRecord := Router.Group("dept")
	DeptApi := v1.ApiGroupApp.SystemApiGroup.SysDeptApi
	{
		deptRouterWithoutRecord.POST("getDeptList", DeptApi.GetDeptList) //获取用户角色菜单
		deptRouterWithoutRecord.POST("upsetDept", DeptApi.UpsetDept)
		deptRouterWithoutRecord.POST("deleteDept", DeptApi.DeleteDept)

	}
	return deptRouterWithoutRecord
}
