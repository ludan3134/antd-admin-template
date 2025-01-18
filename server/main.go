package main

import (
	"github.com/golang-module/carbon/v2"
	"go.uber.org/zap"
	"server/core"
	"server/global"
	internal "server/initialize"
)

func main() {
	//读取配置文件
	global.GVA_VP = core.Viper()
	// 初始化zap日志库
	global.GVA_LOG = core.Zap()
	//将日志记录器设置为全局变量
	zap.ReplaceGlobals(global.GVA_LOG)
	//初始化表格样式
	internal.InitialAttendanceStyle()
	// 连接配置Mysql
	global.GVA_DB = internal.GORM_MYSQL()
	carbon.SetDefault(carbon.Default{
		Layout:       carbon.DateTimeLayout,
		Timezone:     carbon.Local,
		WeekStartsAt: carbon.Sunday,
		Locale:       "en",
	})

	if global.GVA_DB != nil {
		internal.RegisterTables() // 初始化表
		// 程序结束前关闭数据库链接
		db, _ := global.GVA_DB.DB()
		defer db.Close()
	}
	core.RunWindowsServer()

}
