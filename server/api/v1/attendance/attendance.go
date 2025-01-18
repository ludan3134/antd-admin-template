package attendance

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"server/global"
	"server/model/attendance"
	"server/model/attendance/request"
	request2 "server/model/common/request"
	"server/model/common/response"
)

type AttendanceApi struct{}

// 获取部门下拉框
func (b *AttendanceApi) ImportExcel(c *gin.Context) {
	var params []attendance.InitialAttendanceRecord
	err := c.ShouldBindJSON(&params)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	attendanceService.ImportExcel(params)
	response.OkWithDetailed(response.PageResult{
		List: nil,
	}, "获取成功", c)
}
func (b *AttendanceApi) ExportAttendanceSheets(c *gin.Context) {
	var params request.ExportAttendanceSheets
	err := c.ShouldBindJSON(&params)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	file, err := attendanceService.ExportAttendanceSheets(params)
	if err != nil {
		response.FailWithMessage("导出失败"+err.Error(), c)
		return
	}
	c.Header("responseType", "blob")
	c.Header("Content-Disposition", "attachment; filename=attendance.xlsx")
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	err = file.Write(c.Writer)
	if err != nil {
		response.FailWithMessage("导出失败"+err.Error(), c)
	}
	response.OkWithDetailed(response.PageResult{}, "返回响应成功", c)
}
func (b *AttendanceApi) GetAttendanceList(c *gin.Context) {
	var pageInfo request2.PageInfo
	err := c.ShouldBindJSON(&pageInfo)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	list, total, err := attendanceService.GetAttendanceList(pageInfo)
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
func (b *AttendanceApi) UpsetAttendance(c *gin.Context) {
	var params attendance.AttendanceRecord
	err := c.ShouldBindJSON(&params)
	params.Machine = "test"
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = attendanceService.UpsetAttendance(params)
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
func (b *AttendanceApi) DeleteAttendance(c *gin.Context) {
	var params request2.DeleteIds
	err := c.ShouldBindJSON(&params)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = attendanceService.DeleteAttendance(params)
	if err != nil {
		global.GVA_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	response.OkWithDetailed(response.PageResult{
		Total: 0,
	}, "success", c)
}
