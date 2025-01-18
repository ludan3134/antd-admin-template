package request

// Casbin info structure
type ExportAttendanceSheets struct {
	StartDate string `json:"startDate"` // 路径
	EndDate   string `json:"endDate"`   // 方法
}
type AttendanceForPerson struct {
	Name string `json:"name"` // 用户名称
	ExportAttendanceSheets
}
