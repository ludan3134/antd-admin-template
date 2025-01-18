package attendance

import "server/service"

type ApiGroup struct {
	AttendanceRouter
}

var (
	attendanceService = service.ServiceGroupApp.AttendanceServiceGroup.AttendanceService
)
