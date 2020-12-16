package base

import (
	"github.com/massarakhsh/lik"
)

var indexData = 0

func BuildMarshal(index int) lik.Seter {
	indexData++
	answer := lik.BuildSet("index", indexData)
	register := lik.BuildSet()
	answer.SetItem(register, "register")
	for _, table := range []string {"IPZone","IP","Ping"} {
		tbl := lik.BuildSet()
		register.SetItem(tbl, table)
		list := GetList(table)
		for ne := 0; ne < list.Count(); ne++ {
			if elm := list.GetSet(ne); elm != nil {
				tbl.SetItem(elm, elm.GetString("SysNum"))
			}
		}
	}
	return answer
}

