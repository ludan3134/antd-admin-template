package attendance

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"server/global"
	"server/model/attendance"
	request2 "server/model/common/request"
	"server/model/common/response"
)

type AttendanceDateApi struct{}

func (b *AttendanceDateApi) GetAttendanceDateList(c *gin.Context) {
	var pageInfo request2.PageInfo
	err := c.ShouldBindJSON(&pageInfo)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	list, total, err := attendanceDateService.GetAttendanceDateList(pageInfo)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	response.OkWithDetailed(response.PageResult{
		List:  list,
		Total: total,
	}, "获取成功", c)
}
func (b *AttendanceDateApi) UpsetAttendanceDate(c *gin.Context) {
	var params attendance.AttendanceDate
	err := c.ShouldBindJSON(&params)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = attendanceDateService.UpsetAttendanceDate(params)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	response.OkWithDetailed(response.PageResult{
		Total: 0,
	}, "success", c)
}

// 插入/更新角色
func (b *AttendanceDateApi) DeleteAttendanceDate(c *gin.Context) {
	var params request2.DeleteIds
	err := c.ShouldBindJSON(&params)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = attendanceDateService.DeleteAttendanceDate(params)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	response.OkWithDetailed(response.PageResult{
		Total: 0,
	}, "success", c)
}
