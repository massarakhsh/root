package front

import (
	"github.com/massarakhsh/lik"
	"github.com/massarakhsh/root/data"
	"github.com/massarakhsh/root/one"
)

func (rule *DataRule) ApiExecute() lik.Seter {
	if rule.IsShift("list") {
		rule.apiList(rule.Shift())
	} else if rule.IsShift("get") {
		rule.apiGet(rule.Shift(), lik.StrToIDB(rule.Shift()))
	} else if rule.IsShift("marshal") {
		rule.apiMarshal(lik.StrToInt(rule.Shift()))
	}
	return rule.GetAllResponse()
}

func (rule *DataRule) apiList(table string) {
	list := one.GetList(table, "SysNum")
	rule.SetResponse(list, table)
}

func (rule *DataRule) apiGet(table string, sys lik.IDB) {
	elm := one.GetElm(table, sys)
	rule.SetResponse(elm, table)
}

func (rule *DataRule) apiMarshal(index int) {
	answer := data.BuildMarshal(index)
	for _,set := range answer.Values() {
		rule.SetResponse(set.Val, set.Key)
	}
}

