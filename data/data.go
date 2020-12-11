package data

import (
	"github.com/massarakhsh/lik"
	"github.com/massarakhsh/root/one"
)

var indexData = 0

func BuildMarshal(index int) lik.Seter {
	indexData++
	answer := lik.BuildSet("index", indexData)
	for _,tbl := range []string {"IPZone","IP","Unit"} {
		list := one.GetList(tbl, "SysNum")
		answer.SetItem(list, tbl)
	}
	return answer
}

