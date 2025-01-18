package response

import (
	"server/model/system"
)

type SysDeptResponse struct {
	SysDept system.SysDept `json:"sysDept"`
}

type GetDeptLabelResponse struct {
	User  system.SysUser `json:"user"`
	Token string         `json:"token"`
}
