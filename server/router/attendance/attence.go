package attendance

import (
	"github.com/gin-gonic/gin"
	v1 "server/api/v1"
)

type AttendanceRouter struct{}

func (s *AttendanceRouter) InitAttendanceRouter(Router *gin.RouterGroup) {
	AttendanceRouterWithoutRecord := Router.Group("attendance")
	attendanceApi := v1.ApiGroupApp.AttendanceApiGroup.AttendanceApi
	attendanceDateApi := v1.ApiGroupApp.AttendanceApiGroup.AttendanceDateApi
	{
		//考勤记录管理
		AttendanceRouterWithoutRecord.POST("importExcel", attendanceApi.ImportExcel)
		AttendanceRouterWithoutRecord.POST("exportAttendanceSheets", attendanceApi.ExportAttendanceSheets) // 导出数据
		AttendanceRouterWithoutRecord.POST("getAttendanceList", attendanceApi.GetAttendanceList)
		AttendanceRouterWithoutRecord.POST("upsetAttendance", attendanceApi.UpsetAttendance)
		AttendanceRouterWithoutRecord.POST("deleteAttendance", attendanceApi.DeleteAttendance)
		//考勤日期管理
		AttendanceRouterWithoutRecord.POST("getAttendanceDateList", attendanceDateApi.GetAttendanceDateList)
		AttendanceRouterWithoutRecord.POST("upsetAttendanceDate", attendanceDateApi.UpsetAttendanceDate)
		AttendanceRouterWithoutRecord.POST("deleteAttendanceDate", attendanceDateApi.DeleteAttendanceDate)

	}
}
