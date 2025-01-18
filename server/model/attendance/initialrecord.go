package attendance

type InitialAttendanceRecord struct {
	EmployNum string `json:"employNum"`
	Name      string `json:"name"`
	Machine   string `json:"machine"`
	Time      string `json:"time"`
}
