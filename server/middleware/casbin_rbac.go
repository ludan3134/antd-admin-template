package middleware

import (
	"github.com/gin-gonic/gin"
	"server/global"
	"server/model/common/response"
	"server/service"
	"server/utils"
	"strconv"
	"strings"
)

var casbinService = service.ServiceGroupApp.SystemServiceGroup.CabinService

// CasbinHandler 拦截器
func CasbinHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		waitUse, _ := utils.GetClaims(c)
		//获取请求的PATH
		path := c.Request.URL.Path
		obj := strings.TrimPrefix(path, global.GVA_CONFIG.System.RouterPrefix)
		// 获取请求方法
		act := c.Request.Method
		// 获取用户的角色
		e := casbinService.Casbin() // 判断策略中是否存在
		for _, authorityId := range waitUse.RoleIds {
			roleId := strconv.Itoa(int(authorityId)) // 确保authorityId是int类型
			success, _ := e.Enforce(roleId, obj, act)
			if success {
				c.Next() // 如果有权限，继续执行
				return
			}
		}
		// 如果所有角色都没有权限，则返回权限不足
		response.FailWithDetailed(gin.H{}, "权限不足", c)
		c.Abort()
		c.Next()
	}
}
