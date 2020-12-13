package base

import (
	"github.com/massarakhsh/lik"
)

var indexData = 0

func BuildMarshal(index int) lik.Seter {
	indexData++
	answer := lik.BuildSet("index", indexData)
	for _,tbl := range []string {"IPZone","IP","Ping"} {
		list := GetList(tbl)
		answer.SetItem(list, tbl)
	}
	return answer
}

