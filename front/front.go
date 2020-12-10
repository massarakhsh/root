package front

import (
	"github.com/massarakhsh/lik"
)

func (rule *DataRule) Execute() lik.Seter {
	rule.SeekPageSize()
	rule.execute()
	return rule.GetAllResponse()
}

func (rule *DataRule) execute() {
	//if rule.IsShift("list") {
	//	rule.apiList(rule.Shift())
	//} else if rule.IsShift("time") {
	//	rule.execTime()
	//}
}

func (rule *DataRule) execTime() {
	rule.SetResponse("12:34", "menutime")
}
