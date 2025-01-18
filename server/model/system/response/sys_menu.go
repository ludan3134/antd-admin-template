package response

import "server/model/system"

type SysMenusResponse struct {
	Menus []system.SysMenu `json:"menus"`
}
