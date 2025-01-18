package system

type CasbinRule struct {
	Id    int64  `json:"id"`    // 用户UUID
	Ptype string `json:"ptype"` // 测试类型
	V0    string `json:"v0" `   // 用户角色
	V1    string `json:"v1" `   // 请求路径
	V2    string `json:"v2" `   // 请求方式
	V3    string `json:"v3" `
	V4    string `json:"v4" `
	V5    string `json:"v5" `
}
type CabinRuleForList struct {
	Id    int64  `json:"id"`    // 用户UUID
	Ptype string `json:"ptype"` // 测试类型
	V0    string `json:"v0" `   // 用户角色
	V1    string `json:"v1" `   // 请求路径
	V2    string `json:"v2" `   // 请求方式
	V3    string `json:"v3" `
	V4    string `json:"v4" `
	V5    string `json:"v5" `
	Name  string `json:"name"`
}

func (CasbinRule) TableName() string {
	return "casbin_rule"
}
