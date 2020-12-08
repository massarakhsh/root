package front

import "github.com/massarakhsh/root/one"

func (rule *DataRule) apiList(table string) {
	list := one.GetList(table, "SysNum")
	rule.SetResponse(list, "answer")
}
