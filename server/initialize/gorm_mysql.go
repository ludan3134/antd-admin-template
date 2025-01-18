package initialize

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"go.uber.org/zap"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
	"log"
	"os"
	"server/global"
	"server/model/attendance"
	"server/model/system"
	"time"
)

var Gorm = new(_gorm)

type _gorm struct{}

// GormMysql 初始化Mysql数据库
// Author [piexlmax](https://github.com/piexlmax)
// Author [SliverHorn](https://github.com/SliverHorn)
func GORM_MYSQL() *gorm.DB {
	m := global.GVA_CONFIG.Mysql
	if m.Dbname == "" {
		return nil
	}
	mysqlConfig := mysql.Config{
		DSN:                       m.Dsn(), // DSN data source name
		DefaultStringSize:         191,     // string 类型字段的默认长度
		SkipInitializeWithVersion: false,   // 根据版本自动配置
	}
	i := Gorm.Config(m.Prefix, m.Singular)
	if db, err := gorm.Open(mysql.New(mysqlConfig), i); err != nil {
		return nil
	} else {
		db.InstanceSet("gorm:table_options", "ENGINE="+m.Engine)
		sqlDB, _ := db.DB()
		sqlDB.SetMaxIdleConns(m.MaxIdleConns)
		sqlDB.SetMaxOpenConns(m.MaxOpenConns)
		return db
	}
}
func (g *_gorm) Config(prefix string, singular bool) *gorm.Config {
	var general = global.GVA_CONFIG.Mysql.GeneralDB
	return &gorm.Config{
		Logger: logger.New(NewWriter(general, log.New(os.Stdout, "\r\n", log.LstdFlags)), logger.Config{
			SlowThreshold: 200 * time.Millisecond,
			LogLevel:      general.LogLevel(),
			Colorful:      true,
		}),
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   prefix,
			SingularTable: singular,
		},
		DisableForeignKeyConstraintWhenMigrating: true,
	}
}
func RegisterTables() {
	db := global.GVA_DB
	err := db.AutoMigrate(
		system.SysMenu{},
		system.SysRole{},
		system.SysUser{},
		system.SysDept{},
		attendance.AttendanceRecord{},
		attendance.AttendanceDate{},
		//system.SysDept{},
		//system.SysRoleMenu{},
		//system.SysBtn{},
		//system.SysRoleBtn{},
	)
	if err != nil {
		global.GVA_LOG.Error("register table failed", zap.Error(err))
		fmt.Println("err", err)
		os.Exit(0)
	}
	global.GVA_LOG.Info("register table success")
}
