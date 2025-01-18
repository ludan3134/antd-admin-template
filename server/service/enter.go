package service

import (
	"server/service/attendace"
	"server/service/system"
)

type ServiceGroup struct {
	SystemServiceGroup     system.ServiceGroup
	AttendanceServiceGroup attendace.ServiceGroup
}

var ServiceGroupApp = new(ServiceGroup)
