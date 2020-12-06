// Интерфейс базы данных
package one

import (
	"fmt"
	"github.com/massarakhsh/lik"
	"github.com/massarakhsh/lik/likbase"
)

var DB likbase.DBaser

//	Инициализация базы данных
func OpenBase(serv string, base string, user string, pass string) bool {
	likbase.FId = "SysNum"
	logon := user + ":" + pass
	addr := "tcp(" + serv + ":3306)"
	if DB = likbase.OpenDBase("mysql", logon, addr, base); DB == nil {
		lik.SayError(fmt.Sprint("DB not opened"))
		return false
	}
	return true
}

func GetElm(part string, id lik.IDB) lik.Seter {
	return DB.GetOneById(part, id)
}

func InsertElm(part string, sets lik.Seter) lik.IDB {
	return DB.InsertElm(part, sets)
}

func UpdateElm(part string, id lik.IDB, sets lik.Seter) bool {
	return DB.UpdateElm(part, id, sets)
}

func GetList(part string, sort string) lik.Lister {
	order := ""
	if sort == "SysNum" {
		order = "SysNum"
	} else if sort == "_SysNum" {
		order = "SysNum DESC"
	}
	return DB.GetListElm("*", part, "", order)
}

func DeleteElm(part string, id lik.IDB) bool {
	return DB.DeleteElm(part, id)
}

func GetLastId(part string) lik.IDB {
	id,_ := DB.CalculeIDB(DB.PrepareSql("MAX(SysNum)", part, "", ""))
	return id
}

