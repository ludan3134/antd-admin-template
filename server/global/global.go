package global

import (
	"github.com/songzhibin97/gkit/cache/local_cache"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"golang.org/x/sync/singleflight"
	"gorm.io/gorm"
	"server/config"
)

var (
	GVA_DB                  *gorm.DB
	GVA_CONFIG              config.Server
	GVA_VP                  *viper.Viper
	GVA_LOG                 *zap.Logger
	BlackCache              local_cache.Cache
	GVA_Concurrency_Control = &singleflight.Group{}
)
