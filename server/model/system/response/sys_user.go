package response

import (
	"server/model/system"
)

type SysUserResponse struct {
	User system.SysUser `json:"user"`
}

type LoginResponse struct {
	User  system.SysUser `json:"user"`
	Token string         `json:"token"`
}
