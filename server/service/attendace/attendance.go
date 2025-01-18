package attendace

import (
	"fmt"
	"github.com/golang-module/carbon/v2"
	"github.com/xuri/excelize/v2"
	"go.uber.org/zap"
	"gorm.io/gorm/clause"
	"server/global"
	"server/model/attendance"
	"server/model/attendance/request"
	request2 "server/model/common/request"
	"server/model/system"
	"strconv"
)

type AttendanceService struct{}

// 注册

func (attendanceService *AttendanceService) ImportExcel(initialRecords []attendance.InitialAttendanceRecord) error {
	db := global.GVA_DB
	//数据进行分类,并打印
	startDate := carbon.Parse(initialRecords[0].Time).ToDateString()
	endDate := carbon.Parse(initialRecords[len(initialRecords)-1].Time).ToDateString()
	db.Where("date BETWEEN ? AND ?", startDate, endDate).Delete(&attendance.AttendanceRecord{})
	classifiedRecords := make(map[string]map[string][]attendance.InitialAttendanceRecord)
	for _, record := range initialRecords {
		dateString := carbon.Parse(record.Time).ToDateString()

		if _, ok := classifiedRecords[record.EmployNum]; !ok {
			classifiedRecords[record.EmployNum] = make(map[string][]attendance.InitialAttendanceRecord)
		}
		classifiedRecords[record.EmployNum][dateString] = append(classifiedRecords[record.EmployNum][dateString], record)

	}
	var attendanceRecords []attendance.AttendanceRecord

	for employNum, dates := range classifiedRecords {
		for date, records := range dates {
			var clockInTime, clockOutTime carbon.Carbon
			clockInTime = carbon.Parse(records[0].Time)
			clockOutTime = clockInTime
			////上午上班时间
			//var dept system.SysDept
			//db.First(&dept).Where("id = ?", employNum)
			//punchIn2 := carbon.Parse(dept.ClickInTime[1]).SetDate(clockInTime.Year(), clockInTime.Month(), clockInTime.Day())
			////下午上班时间
			//punchOut := carbon.Parse(dept.ClickOutTime[0]).SetDate(clockOutTime.Year(), clockOutTime.Month(), clockOutTime.Day())

			for _, record := range records {
				if carbon.Parse(record.Time).Gt(clockOutTime) {
					clockOutTime = carbon.Parse(record.Time)
				} else if carbon.Parse(record.Time).Lt(clockInTime) {
					clockInTime = carbon.Parse(record.Time)
				}
			}

			attendanceRecord := attendance.AttendanceRecord{
				EmployNum:    employNum,
				Name:         records[0].Name,
				Machine:      records[0].Machine,
				Date:         date,
				ClockInTime:  clockInTime.String(),
				ClockOutTime: clockOutTime.String(),
				//ClockInTime: func() string {
				//	if clockInTime.Gt(punchIn2) {
				//		return "早上缺卡"
				//	} else {
				//		return clockInTime.String()
				//	}
				//}(),
				//ClockOutTime: func() string {
				//	if clockOutTime.Lt(punchOut) {
				//		return "下午缺卡"
				//	} else {
				//		return clockOutTime.String()
				//	}
				//}(),
			}
			attendanceRecords = append(attendanceRecords, attendanceRecord)
		}
	}
	db.CreateInBatches(attendanceRecords, len(attendanceRecords))
	//数据进行分类,并打印
	return nil
}
func (attendanceService *AttendanceService) ExportAttendanceSheets(params request.ExportAttendanceSheets) (*excelize.File, error) {
	//获取参数
	startDate := carbon.Parse(params.StartDate)
	endDate := carbon.Parse(params.EndDate)
	diffAbsInDays := startDate.DiffAbsInDays(endDate)

	//创建文件
	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	//查找所有打卡记录,并进行组装
	var attendanceRecords []attendance.AttendanceRecord
	global.GVA_DB.Where("date >= ? AND  date <= ? ", startDate.ToDateString(), endDate.ToDateString()).Find(&attendanceRecords)
	//用于打卡记录
	classifiedRecords := make(map[string]map[string][]attendance.AttendanceRecord)
	for _, record := range attendanceRecords {
		if _, ok := classifiedRecords[record.EmployNum]; !ok {
			classifiedRecords[record.EmployNum] = make(map[string][]attendance.AttendanceRecord)
		}
		classifiedRecords[record.EmployNum][record.Date] = append(classifiedRecords[record.EmployNum][record.Date], record)
	}

	//获取样式
	titleStyle, _ := f.NewStyle(&global.TitleStyleDef)
	cellStyle, _ := f.NewStyle(&global.CenterStyleDef)
	//填充第一行数据,作为标题
	days := int(startDate.DiffAbsInDays(endDate) + 2)
	columnLen, _ := excelize.ColumnNumberToName(days) //指定导出行数
	var StandardWorkHours int                         //标准工作时数
	var StandardWorkDays int                          //标准出勤天数
	//创建工作表
	sheetName := "考勤记录表"
	_, err := f.NewSheet(sheetName)
	if err != nil {
		fmt.Println(err)
		return f, err
	}
	//填充标题值
	f.MergeCell(sheetName, "A1", columnLen+"2")
	f.SetCellValue(sheetName, "A1", "考勤记录表")
	f.SetCellStyle(sheetName, "A1", "A1", titleStyle) //设置标题样式
	//设置列样式
	f.SetColWidth(sheetName, "A", "A", 5)
	f.SetColWidth(sheetName, "B", columnLen, 11)
	//填充标题值
	//填充日期值
	for i := 1; i < days; i++ {
		beginColumn, _ := excelize.ColumnNumberToName(i + 1)
		// 计算当前日期并设置单元格值
		currentDate := startDate.AddDays(i - 1)
		f.SetCellValue(sheetName, beginColumn+"3", currentDate.ToDateString())
		f.SetCellValue(sheetName, beginColumn+"4", "星期 "+strconv.Itoa(currentDate.DayOfWeek()))
		f.SetRowStyle(sheetName, 3, 4, cellStyle)
		isWorkday, _ := IsWorkday(currentDate)
		if isWorkday {
			StandardWorkHours += 8
			StandardWorkDays++
		}
	}

	//填充日期值
	rowIndex := 5 // 开始插入正式数据的行数
	for employNum, datesToRecords := range classifiedRecords {
		var dept system.SysDept
		global.GVA_DB.First(&dept).Where("id = ?", employNum)
		if len(datesToRecords) == 0 {
			continue // 如果为空，则跳过这个员工
		}
		f.MergeCell(sheetName, "A"+strconv.Itoa(rowIndex), columnLen+strconv.Itoa(rowIndex))
		f.SetCellValue(sheetName, "A"+strconv.Itoa(rowIndex), "员工名称:"+datesToRecords[startDate.ToDateString()][0].Name) //并列行,填充个人信息,作为区分
		f.SetCellStyle(sheetName, "A"+strconv.Itoa(rowIndex), "A"+strconv.Itoa(rowIndex), cellStyle)
		for i := 0; i < days; i++ {
			f.SetRowStyle(sheetName, rowIndex+1, rowIndex+2, cellStyle)
			f.SetRowHeight(sheetName, rowIndex+1, 14)
			f.SetRowHeight(sheetName, rowIndex+2, 14)
			if i == 0 {
				f.SetCellValue(sheetName, "A"+strconv.Itoa(rowIndex+1), "上班")
				f.SetCellValue(sheetName, "A"+strconv.Itoa(rowIndex+2), "下班")
				continue
			}
			beginColumn, _ := excelize.ColumnNumberToName(i + 1)
			currentDateForAdd := startDate.AddDays(i - 1).ToDateString()

			for date, records := range datesToRecords {
				if date != currentDateForAdd {
					continue
				}
				//部门上午下班时间
				punchIn2 := carbon.Parse(dept.ClickInTime[1]).SetDate(startDate.AddDays(i-1).Year(), startDate.AddDays(i-1).Month(), startDate.AddDays(i-1).Day())
				//部门下午上班时间
				punchOut := carbon.Parse(dept.ClickOutTime[0]).SetDate(startDate.AddDays(i-1).Year(), startDate.AddDays(i-1).Month(), startDate.AddDays(i-1).Day())
				isWorkday, attendanceDate := IsWorkday(startDate.AddDays(i - 1))
				//今天是工作日且返回了加班的工作时间
				if isWorkday && attendanceDate.Id != 0 {
					punchIn2 = carbon.Parse(attendanceDate.ClickInTime[1]).SetDate(startDate.AddDays(i-1).Year(), startDate.AddDays(i-1).Month(), startDate.AddDays(i-1).Day())
					punchOut = carbon.Parse(attendanceDate.ClickOutTime[0]).SetDate(startDate.AddDays(i-1).Year(), startDate.AddDays(i-1).Month(), startDate.AddDays(i-1).Day())
				}
				var clickInTime string
				var clickOutTime string

				if carbon.Parse(records[0].ClockInTime).Gt(punchIn2) {
					clickInTime = "早上缺卡"
				} else {
					clickInTime = carbon.Parse(records[0].ClockInTime).ToTimeString()
				}
				if carbon.Parse(records[0].ClockOutTime).Lt(punchOut) {
					clickOutTime = "下午缺卡"
				} else {
					clickOutTime = carbon.Parse(records[0].ClockOutTime).ToTimeString()
				}
				f.SetCellValue(sheetName, beginColumn+strconv.Itoa(rowIndex+1), clickInTime)  //上班打卡时间
				f.SetCellValue(sheetName, beginColumn+strconv.Itoa(rowIndex+2), clickOutTime) //下班打卡时间
				f.MergeCell(sheetName, "A"+strconv.Itoa(rowIndex+3), columnLen+strconv.Itoa(rowIndex+3))
			}
		}
		rowIndex = rowIndex + 4
	}
	// <-------------------------------------------------------------------->//
	//考勤汇总表
	sheetName2 := "考勤汇总表"
	_, err = f.NewSheet(sheetName2)
	if err != nil {
		fmt.Println(err)
		return f, err
	}

	f.MergeCell(sheetName2, "A1", "N1")
	f.SetCellValue(sheetName2, "A1", "考勤汇总表")
	f.MergeCell(sheetName2, "A2", "N2")
	f.SetCellValue(sheetName2, "A2", "日期:"+startDate.ToDateString()+"----->"+endDate.ToDateString())
	f.SetCellStyle(sheetName2, "A1", "A1", titleStyle) //设置标题样式
	f.SetColWidth(sheetName2, "A", "N", 12)
	//填充其他行样式
	f.SetRowStyle(sheetName2, 3, 100, cellStyle)
	// 填充首行
	f.MergeCell(sheetName2, "A3", "A4")
	f.SetCellValue(sheetName2, "A3", "工号")

	f.MergeCell(sheetName2, "B3", "B4")
	f.SetCellValue(sheetName2, "B3", "姓名")

	f.MergeCell(sheetName2, "C3", "C4")
	f.SetCellValue(sheetName2, "C3", "所属部门")

	f.MergeCell(sheetName2, "D3", "E3")
	f.SetCellValue(sheetName2, "D3", "工作时数")
	f.SetCellValue(sheetName2, "D4", "标准")
	f.SetCellValue(sheetName2, "E4", "实际")

	f.MergeCell(sheetName2, "F3", "G3")
	f.SetCellValue(sheetName2, "F3", "迟到")
	f.SetCellValue(sheetName2, "F4", "次数")
	f.SetCellValue(sheetName2, "G4", "分数")

	f.MergeCell(sheetName2, "H3", "I3")
	f.SetCellValue(sheetName2, "H3", "早退")
	f.SetCellValue(sheetName2, "H4", "次数")
	f.SetCellValue(sheetName2, "I4", "分数")

	f.MergeCell(sheetName2, "J3", "K3")
	f.SetCellValue(sheetName2, "J3", "加班")
	f.SetCellValue(sheetName2, "J4", "次数")
	f.SetCellValue(sheetName2, "K4", "小时")

	f.MergeCell(sheetName2, "L3", "L4")
	f.SetCellValue(sheetName2, "L3", "应出勤天数")

	f.MergeCell(sheetName2, "M3", "M4")
	f.SetCellValue(sheetName2, "M3", "缺勤次数")

	f.MergeCell(sheetName2, "N3", "N4")
	f.SetCellValue(sheetName2, "N3", "缺卡次数")
	//用于打卡记录汇总
	var summaryRecords []attendance.AttendanceSummary
	//err = global.GVA_DB.Table("attendance_record").Where("date >= ? AND date <= ?", startDate.ToDateString(), endDate.ToDateString()).
	//	Select("employ_num, `name`, SUM(is_late) AS LateTimes, SUM(minutes_late) AS LateMinutes, SUM(is_early) AS EarlyTimes, SUM(minutes_early) AS EarlyMinutes, SUM(actual_hours_worked) AS ActualWorkHours, SUM(is_work_over_time) AS NormalWorkTimes,SUM(minutes_over_time) AS NormalWorkMinutes,SUM(is_absence) AS ActualWorkDays").
	//	Group("employ_num,`name`").
	//	Scan(&summaryRecords).Error
	for _, datesToRecords := range classifiedRecords {
		//创建对象
		var employeeAttendance attendance.AttendanceSummary
		//上午上班时间
		name := datesToRecords[startDate.ToDateString()][0].Name
		var user system.SysUser
		global.GVA_DB.Where("username = ?", name).First(&user)
		if user.ID == 0 {
			global.GVA_LOG.Error("该用户非本公司员工!", zap.Error(err))
			continue
		}
		var dept system.SysDept
		global.GVA_DB.Where("id = ?", user.DeptId).First(&dept)
		if dept.Id == 0 {
			global.GVA_LOG.Error("该员工暂不属于公司任一所属部门!", zap.Error(err))
			continue
		}
		employeeAttendance.DeptName = dept.Name
		if len(datesToRecords) < int(diffAbsInDays) {
			employeeAttendance.AbsentTimes = int(diffAbsInDays) - len(datesToRecords)
		}
		for date, record := range datesToRecords {
			currentDate := carbon.Parse(date)
			//判断日期是否正常上班时间
			fmt.Println("currentDate", currentDate)
			clickInTime := carbon.Parse(record[0].ClockInTime)
			clickOutTime := carbon.Parse(record[0].ClockOutTime)
			employeeAttendance.Name = record[0].Name
			employeeAttendance.EmployNum = record[0].EmployNum
			punchIn := carbon.Parse(dept.ClickInTime[0]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
			punchIn2 := carbon.Parse(dept.ClickInTime[1]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
			punchOut := carbon.Parse(dept.ClickOutTime[0]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
			punchOut2 := carbon.Parse(dept.ClickOutTime[1]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
			isWorkday, attendanceDate := IsWorkday(currentDate)
			//计算实际工作时数
			employeeAttendance.ActualWorkHours += clickOutTime.DiffAbsInHours(clickInTime)
			//这是属于加班的做法
			if isWorkday && attendanceDate.Id != 0 {
				//判断是否节假日不用上班
				punchIn = carbon.Parse(attendanceDate.ClickInTime[0]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
				punchIn2 = carbon.Parse(attendanceDate.ClickInTime[1]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
				punchOut = carbon.Parse(attendanceDate.ClickOutTime[0]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
				punchOut2 = carbon.Parse(attendanceDate.ClickOutTime[1]).SetDate(currentDate.Year(), currentDate.Month(), currentDate.Day())
				employeeAttendance.OverWorkTimes++
				employeeAttendance.OverWorkMinutes += clickOutTime.DiffAbsInHours(clickInTime)
				continue
			}

			//判断是否迟到
			if clickInTime.BetweenIncludedBoth(punchIn, punchIn2) {
				employeeAttendance.LateMinutes += clickInTime.DiffAbsInMinutes(punchIn)
				employeeAttendance.LateTimes++
				fmt.Println("是否迟到:是.迟到时长:", clickInTime.DiffAbsInMinutes(punchIn))
			} else if clickInTime.Gt(punchIn2) {
				employeeAttendance.MissTimes++
			}
			//判断是否早退
			if clickOutTime.BetweenIncludedBoth(punchOut, punchOut2) {
				employeeAttendance.EarlyTimes++
				employeeAttendance.EarlyMinutes += clickOutTime.DiffAbsInMinutes(punchOut2)
				fmt.Println("是否早退:是.早退时长:", clickOutTime.DiffAbsInMinutes(punchOut2))
			} else if clickOutTime.Lt(punchOut) {
				employeeAttendance.MissTimes++
			}
			//else if clickOutTime.Gt(punchOut2) {
			//	employeeAttendance.OverWorkTimes++
			//	employeeAttendance.OverWorkMinutes += clickOutTime.DiffAbsInMinutes(punchOut2)
			//}
		}
		summaryRecords = append(summaryRecords, employeeAttendance)
	}

	if err != nil {
		return f, err
	}
	rowIndex2 := 5 // 开始插入正式数据的行数
	for _, record := range summaryRecords {
		f.SetCellValue(sheetName2, "A"+strconv.Itoa(rowIndex2), record.EmployNum)                                              //工号
		f.SetCellValue(sheetName2, "B"+strconv.Itoa(rowIndex2), record.Name)                                                   //姓名
		f.SetCellValue(sheetName2, "C"+strconv.Itoa(rowIndex2), record.DeptName)                                               //所属部门
		f.SetCellValue(sheetName2, "D"+strconv.Itoa(rowIndex2), StandardWorkHours)                                             //标准工作时数
		f.SetCellValue(sheetName2, "E"+strconv.Itoa(rowIndex2), LimitWorkHour(StandardWorkHours, int(record.ActualWorkHours))) //实际工作时数
		f.SetCellValue(sheetName2, "F"+strconv.Itoa(rowIndex2), record.LateTimes)                                              //迟到次数
		f.SetCellValue(sheetName2, "G"+strconv.Itoa(rowIndex2), record.LateMinutes)                                            //迟到分钟数
		f.SetCellValue(sheetName2, "H"+strconv.Itoa(rowIndex2), record.EarlyTimes)                                             //早退次数
		f.SetCellValue(sheetName2, "I"+strconv.Itoa(rowIndex2), record.EarlyMinutes)                                           //早退分钟数
		f.SetCellValue(sheetName2, "J"+strconv.Itoa(rowIndex2), record.OverWorkTimes)                                          //加班次数
		f.SetCellValue(sheetName2, "K"+strconv.Itoa(rowIndex2), record.OverWorkMinutes)                                        //加班时数
		f.SetCellValue(sheetName2, "L"+strconv.Itoa(rowIndex2), StandardWorkDays)                                              //出勤天数
		f.SetCellValue(sheetName2, "M"+strconv.Itoa(rowIndex2), record.AbsentTimes)                                            //缺勤次数
		f.SetCellValue(sheetName2, "N"+strconv.Itoa(rowIndex2), record.MissTimes)                                              //缺卡次数
		rowIndex2++
	}
	//标准工作时数
	// <-------------------------------------------------------------------->//
	//删除默认工作表	sheet1
	if err := f.DeleteSheet("Sheet1"); err != nil {
		fmt.Println(err)
		return f, err
	}
	return f, nil
}

func (attendanceService *AttendanceService) GetAttendanceList(info request2.PageInfo) (attendanceList []attendance.AttendanceRecord, total int64, err error) {
	limit := info.Limit
	offset := info.Limit * (info.Page - 1)
	db := global.GVA_DB.Model(&attendance.AttendanceRecord{})
	name := info.Name
	if len(name) != 0 {
		db.Where("name LIKE ?", "%"+name+"%")
	}
	err = db.Count(&total).Error

	db.Limit(limit).Offset(offset).Order("'date'").Find(&attendanceList)
	if err != nil {
		return
	}
	return attendanceList, total, err
}

func (attendanceService *AttendanceService) UpsetAttendance(params attendance.AttendanceRecord) error {
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	// 尝试创建或更新记录
	result := tx.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"employ_num", "name", "machine", "date", "clock_in_time", "clock_out_time"}),
	}).Create(&params)

	// 检查创建或更新操作是否成功
	if result.Error != nil {
		tx.Rollback() // 回滚事务，因为创建或更新失败了
		return result.Error
	}
	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}
func (attendanceService *AttendanceService) DeleteAttendance(params request2.DeleteIds) error {
	// 开始事务
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	if err := tx.Where("id IN (?)", params.Ids).Delete(&attendance.AttendanceRecord{}).Error; err != nil {
		tx.Rollback() // 如果有错误，回滚事务
		return err
	}
	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}
	return nil
}
func IsWorkday(currentDate carbon.Carbon) (bool, attendance.AttendanceDate) {
	db := global.GVA_DB
	var attendanceDate attendance.AttendanceDate
	// 尝试从数据库中获取attendanceDate
	if err := db.Where("date = ?", currentDate.ToDateString()).First(&attendanceDate).Error; err == nil {
		// 否则返回false和attendanceDate
		return attendanceDate.IsOnWork, attendanceDate
	}
	// 周一到周五为工作日
	return currentDate.DayOfWeek() >= 1 && currentDate.DayOfWeek() <= 5, attendanceDate
}
func LimitWorkHour(standardHour, actualHour int) int {
	if actualHour > standardHour {
		return standardHour
	}
	return actualHour
}
