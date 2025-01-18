package v1

import (
	"server/api/v1/attendance"
	"server/api/v1/system"
)

type ApiGroup struct {
	SystemApiGroup     system.ApiGroup
	AttendanceApiGroup attendance.ApiGroup
}

var ApiGroupApp = new(ApiGroup)
