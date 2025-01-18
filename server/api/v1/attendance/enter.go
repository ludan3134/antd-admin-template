package attendance

import (
	"server/service"
)

type ApiGroup struct {
	AttendanceApi
	AttendanceDateApi
}

var (
	attendanceService     = service.ServiceGroupApp.AttendanceServiceGroup.AttendanceService
	attendanceDateService = service.ServiceGroupApp.AttendanceServiceGroup.AttendanceDateService
)
