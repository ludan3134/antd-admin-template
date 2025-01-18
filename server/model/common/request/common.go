package request

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// 分页查询参数
type PageInfo struct {
	Page     int    `json:"page" form:"page"`         // 页码
	PageSize int    `json:"pageSize" form:"pageSize"` // 每页大小
	Limit    int    `json:"limit" form:"limit"`       //关键字
	Name     string `json:"name" form:"name"`
	DeptId   string `json:"deptId" form:"deptId"`
	V0       string `json:"v0" form:"v0"`
}

// GetById Find by id structure
type GetById struct {
	ID int `json:"ids" form:"id"` // 主键ID
}
type GetByIds struct {
	IDs []int `json:"ids"` // 主键ID的切片
}

func (r *GetById) Uint() uint {
	return uint(r.ID)
}

type IdsReq struct {
	Ids []int `json:"ids" form:"ids"`
}

// GetAuthorityId Get role by id structure
type GetAuthorityId struct {
	AuthorityId uint `json:"authorityId" form:"authorityId"` // 角色ID
}

type DeleteIds struct {
	Ids []int `json:"ids" form:"ids"` // 删除数组
}
type Empty struct{}

type SliceString []string

func (a *SliceString) Scan(src any) error {
	jsonB, ok := src.([]byte)
	if !ok {
		return errors.New("source is not a byte array")
	}
	if !json.Valid(jsonB) {
		return errors.New("invalid json data")
	}
	return json.Unmarshal(jsonB, a)
}
func (a SliceString) Value() (driver.Value, error) {
	if len(a) == 0 {
		return nil, nil
	}
	jStr, err := json.Marshal(a)
	if err != nil {
		return nil, err
	}
	return []byte(jStr), nil
}
