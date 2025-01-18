package router

import (
	"server/router/attendance"
	"server/router/system"
)

type RouterGroup struct {
	System     system.RouterGroup
	Attendance attendance.AttendanceRouter
}

var RouterGroupApp = new(RouterGroup)
