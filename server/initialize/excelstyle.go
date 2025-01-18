package initialize

import (
	"github.com/xuri/excelize/v2"
	"server/global"
)

// 初始化全局变量
func InitialAttendanceStyle() {
	global.CenterStyleDef = excelize.Style{
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	}
	global.TitleStyleDef = excelize.Style{
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
		Font: &excelize.Font{
			Bold: true,
			Size: 24,
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Color:   []string{"#E0E0E0"},
			Pattern: 1,
		},
	}
}
