package core

import (
	"fmt"
	"go.uber.org/zap"
	"server/global"
	internal "server/initialize"
)

type server interface {
	ListenAndServe() error
}

func RunWindowsServer() {

	Router := internal.Routers()

	address := fmt.Sprintf(":%d", global.GVA_CONFIG.System.Addr)
	s := initServer(address, Router)

	global.GVA_LOG.Info("server run success on ", zap.String("address", address))

	global.GVA_LOG.Error(s.ListenAndServe().Error())
}
