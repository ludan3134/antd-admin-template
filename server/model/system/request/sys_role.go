package request

// 根据角色Id获取菜单列表
type GetMenuByRoId struct {
	RoleId int `json:"roleId"` // 角色Id
}
