package request

// 根据用户分配角色
type SysRoleMenus struct {
	SysRoleID int64 // 假设 SysRoleID 对应 sys_role_menu 表中的 sys_role_id
	SysMenuID int64 // 假设 SysMenuID 对应 sys_role_menu 表中的 sys_menu_id
}

// 筛选菜单
type SysMenusFilter struct {
	Code  string // 假设 SysRoleID 对应 sys_role_menu 表中的 sys_role_id
	Title string // 假设 SysMenuID 对应 sys_role_menu 表中的 sys_menu_id
}
