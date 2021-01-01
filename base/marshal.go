package base

import (
	"github.com/massarakhsh/lik"
	"github.com/massarakhsh/lik/likmarshal"
	"time"
)

func StartMarshal() {
	go func() {
		for !IsStoping {
			UpdateMarshal()
			time.Sleep(time.Second * 10)
		}
	}()
}

func UpdateMarshal() {
	likmarshal.UpdateBase(DB, []string { "IPZone", "IP", "Ping", "Unit", "Link" }, "SysNum")
}

func BuildMarshal(index int) lik.Seter {
	return likmarshal.Answer(index)
}

