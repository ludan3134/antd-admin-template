package attendance

type AttendanceSummary struct {
	EmployNum         string `json:"employNum"`
	Name              string `json:"name"`
	DeptName          string `json:"deptName"`
	StandardWorkHours int64  `json:"standardWorkHours"`
	StandardWorkDays  int64  `json:"standardWorkDays"`
	ActualWorkHours   int64  `json:"actualWorkHours"`
	ActualWorkDays    int64  `json:"actualWorkDays"`
	LateTimes         int64  `json:"lateTimes"`
	LateMinutes       int64  `json:"lateMinutes"`
	EarlyTimes        int64  `json:"earlyTimes"`
	EarlyMinutes      int64  `json:"earlyMinutes"`
	OverWorkTimes     int64  `json:"overWorkTimes"`
	OverWorkMinutes   int64  `json:"overWorkMinutes"`
	AbsentTimes       int    `json:"absentTimes"`
	MissTimes         int    `json:"missTimes"`
}
