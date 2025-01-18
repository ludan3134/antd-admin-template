package system

import (
	"errors"
	"fmt"
	"gorm.io/gorm/clause"
	"server/global"
	request2 "server/model/common/request"
	"server/model/system"
	"server/model/system/request"
	"strconv"
	"sync"

	"gorm.io/gorm"

	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	_ "github.com/go-sql-driver/mysql"
	"go.uber.org/zap"
)

type CabinService struct{}

var CabinServiceApp = new(CabinService)

func (cabinService *CabinService) UpdateCasbin(AuthorityID uint, casbinInfos []request.CasbinInfo) error {
	authorityId := strconv.Itoa(int(AuthorityID))
	cabinService.ClearCasbin(0, authorityId)
	rules := [][]string{}
	//做权限去重处理
	deduplicateMap := make(map[string]bool)
	for _, v := range casbinInfos {
		key := authorityId + v.Path + v.Method
		if _, ok := deduplicateMap[key]; !ok {
			deduplicateMap[key] = true
			rules = append(rules, []string{authorityId, v.Path, v.Method})
		}
	}
	e := cabinService.Casbin()
	success, _ := e.AddPolicies(rules)
	if !success {
		return errors.New("存在相同api,添加失败,请联系管理员")
	}
	return nil
}
func (cabinService *CabinService) GetCabinList(info request2.PageInfo) (list interface{}, total int64, err error) {
	limit := info.Limit
	offset := info.Limit * (info.Page - 1)
	//id := info.DeptId
	v0 := info.V0
	db := global.GVA_DB.Model(&system.CasbinRule{})

	if len(v0) != 0 {
		db.Where("v0 LIKE ?", "%"+v0+"%")
	}
	var cabinList []system.CabinRuleForList
	err = db.Count(&total).Error
	if err != nil {
		return
	}
	err = db.Joins("left join sys_role on sys_role.id = casbin_rule.v0").
		Limit(limit).Offset(offset).
		Select("casbin_rule.*, sys_role.name as name ").
		Find(&cabinList).Error
	fmt.Println("cabinList", cabinList)
	return cabinList, total, err
}

// 分配用户角色
func (cabinService *CabinService) UpsetCabin(params system.CasbinRule) error {
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	params.Ptype = "p"
	// 尝试创建或更新记录
	result := tx.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"ptype", "v0", "v1", "v2"}),
	}).Create(&params)

	// 检查创建或更新操作是否成功
	if result.Error != nil {
		tx.Rollback() // 回滚事务，因为创建或更新失败了
		return result.Error
	}
	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (cabinService *CabinService) DeleteCabin(params request2.DeleteIds) error {
	// 开始事务
	tx := global.GVA_DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	if err := tx.Where("id IN (?)", params.Ids).Delete(&system.CasbinRule{}).Error; err != nil {
		tx.Rollback() // 如果有错误，回滚事务
		return err
	}
	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}
	return nil
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: UpdateCasbinApi
//@description: API更新随动
//@param: oldPath string, newPath string, oldMethod string, newMethod string
//@return: error

func (cabinService *CabinService) UpdateCasbinApi(oldPath string, newPath string, oldMethod string, newMethod string) error {
	err := global.GVA_DB.Model(&gormadapter.CasbinRule{}).Where("v1 = ? AND v2 = ?", oldPath, oldMethod).Updates(map[string]interface{}{
		"v1": newPath,
		"v2": newMethod,
	}).Error
	e := cabinService.Casbin()
	err = e.LoadPolicy()
	if err != nil {
		return err
	}
	return err
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: GetPolicyPathByAuthorityId
//@description: 获取权限列表
//@param: authorityId string
//@return: pathMaps []request.CasbinInfo

func (cabinService *CabinService) GetPolicyPathByAuthorityId(AuthorityID uint) (pathMaps []request.CasbinInfo) {
	e := cabinService.Casbin()
	authorityId := strconv.Itoa(int(AuthorityID))
	list := e.GetFilteredPolicy(0, authorityId)
	for _, v := range list {
		pathMaps = append(pathMaps, request.CasbinInfo{
			Path:   v[1],
			Method: v[2],
		})
	}
	return pathMaps
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: ClearCasbin
//@description: 清除匹配的权限
//@param: v int, p ...string
//@return: bool

func (cabinService *CabinService) ClearCasbin(v int, p ...string) bool {
	e := cabinService.Casbin()
	success, _ := e.RemoveFilteredPolicy(v, p...)
	return success
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: RemoveFilteredPolicy
//@description: 使用数据库方法清理筛选的politicy 此方法需要调用FreshCasbin方法才可以在系统中即刻生效
//@param: db *gorm.DB, authorityId string
//@return: error

func (cabinService *CabinService) RemoveFilteredPolicy(db *gorm.DB, authorityId string) error {
	return db.Delete(&gormadapter.CasbinRule{}, "v0 = ?", authorityId).Error
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: SyncPolicy
//@description: 同步目前数据库的policy 此方法需要调用FreshCasbin方法才可以在系统中即刻生效
//@param: db *gorm.DB, authorityId string, rules [][]string
//@return: error

func (cabinService *CabinService) SyncPolicy(db *gorm.DB, authorityId string, rules [][]string) error {
	err := cabinService.RemoveFilteredPolicy(db, authorityId)
	if err != nil {
		return err
	}
	return cabinService.AddPolicies(db, rules)
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: AddPolicies
//@description: 添加匹配的权限
//@param: v int, p ...string
//@return: bool

func (cabinService *CabinService) AddPolicies(db *gorm.DB, rules [][]string) error {
	var casbinRules []gormadapter.CasbinRule
	for i := range rules {
		casbinRules = append(casbinRules, gormadapter.CasbinRule{
			Ptype: "p",
			V0:    rules[i][0],
			V1:    rules[i][1],
			V2:    rules[i][2],
		})
	}
	return db.Create(&casbinRules).Error
}

func (cabinService *CabinService) FreshCasbin() (err error) {
	e := cabinService.Casbin()
	err = e.LoadPolicy()
	return err
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: Casbin
//@description: 持久化到数据库  引入自定义规则
//@return: *casbin.Enforcer

var (
	syncedCachedEnforcer *casbin.SyncedCachedEnforcer
	once                 sync.Once
)

func (cabinService *CabinService) Casbin() *casbin.SyncedCachedEnforcer {
	once.Do(func() {
		a, err := gormadapter.NewAdapterByDB(global.GVA_DB)
		if err != nil {
			zap.L().Error("适配数据库失败请检查casbin表是否为InnoDB引擎!", zap.Error(err))
			return
		}
		text := `
		[request_definition]
		r = sub, obj, act
		
		[policy_definition]
		p = sub, obj, act
		
		[role_definition]
		g = _, _
		
		[policy_effect]
		e = some(where (p.eft == allow))
		
		[matchers]
		m = r.sub == p.sub && keyMatch2(r.obj,p.obj) && r.act == p.act || r.sub == "1"
		`
		m, err := model.NewModelFromString(text)
		if err != nil {
			zap.L().Error("字符串加载模型失败!", zap.Error(err))
			return
		}
		syncedCachedEnforcer, _ = casbin.NewSyncedCachedEnforcer(m, a)
		syncedCachedEnforcer.SetExpireTime(60 * 60)
		_ = syncedCachedEnforcer.LoadPolicy()
	})
	return syncedCachedEnforcer
}
func ReloadPolicy() {
	err := syncedCachedEnforcer.LoadPolicy()
	if err != nil {
		zap.L().Error("重新加载策略失败", zap.Error(err))
	}
}
