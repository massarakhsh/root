package front

import (
	"github.com/massarakhsh/lik"
)

func (rule *DataRule) Marshal() lik.Seter {
	rule.SeekPageSize()
	return rule.GetAllResponse()
}
