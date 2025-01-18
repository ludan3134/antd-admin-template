package system

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"server/global"
	"server/model/common/request"
	"server/model/common/response"
	"server/model/system"
	system2 "server/service/system"
)

type SysCabinApi struct{}

// 获取Cabin列表
func (b *SysCabinApi) GetCabinList(c *gin.Context) {
	var pageInfo request.PageInfo
	err := c.ShouldBindJSON(&pageInfo)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	list, total, err := cabinService.GetCabinList(pageInfo)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	response.OkWithDetailed(response.PageResult{
		List:     list,
		Total:    total,
		Page:     pageInfo.Page,
		PageSize: pageInfo.PageSize,
	}, "获取成功", c)
}

// 插入/更新角色
func (b *SysCabinApi) UpsetCabin(c *gin.Context) {
	var params system.CasbinRule
	err := c.ShouldBindJSON(&params)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = cabinService.UpsetCabin(params)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	system2.ReloadPolicy()
	response.OkWithDetailed(response.PageResult{
		Total: 0,
	}, "success", c)
}

// 插入/更新角色
func (b *SysCabinApi) DeleteCabin(c *gin.Context) {
	var params request.DeleteIds
	err := c.ShouldBindJSON(&params)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = cabinService.DeleteCabin(params)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	system2.ReloadPolicy()
	response.OkWithDetailed(response.PageResult{
		Total: 0,
	}, "success", c)
}
