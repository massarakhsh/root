package main

import (
	"fmt"
	"github.com/massarakhsh/lik"
	"github.com/massarakhsh/lik/likapi"
	"github.com/massarakhsh/root/base"
	"github.com/massarakhsh/root/front"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	DebugLevel	= 9
)

func main() {
	lik.SetLevelInf()
	lik.SayError("System started")
	if !getArgs() {
		return
	}
	if !base.OpenDB(base.HostServ, base.HostBase, base.HostUser, base.HostPass) {
		return
	}
	startHttp()
	for !base.IsStoping {
		time.Sleep(time.Second)
	}
	time.Sleep(time.Second * 3)
}

func getArgs() bool {
	args, ok := lik.GetArgs(os.Args[1:])
	if val := args.GetString("port"); val != "" {
		base.HttpPort = lik.StrToInt(val)
	}
	if val := args.GetString("serv"); val != "" {
		base.HostServ = val
	}
	if val := args.GetString("base"); val != "" {
		base.HostBase = val
	}
	if val := args.GetString("user"); val != "" {
		base.HostUser = val
	}
	if val := args.GetString("pass"); val != "" {
		base.HostPass = val
	}
	if val := args.GetString("debug"); val != "" {
		DebugLevel = lik.StrToInt(val)
	}
	if !ok {
		fmt.Println("Usage: root [-key val | --key=val]...")
		fmt.Println("port    - port value (80)")
		fmt.Println("serv    - Database server")
		fmt.Println("base    - Database name")
		fmt.Println("user    - Database user")
		fmt.Println("pass    - Database pass")
	}
	return ok
}

func startHttp(){
	http.HandleFunc("/", router)
	if err := http.ListenAndServe(":"+fmt.Sprint(base.HttpPort), nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func router(w http.ResponseWriter, r *http.Request) {
	lik.SetLevelInf()
	lik.SayInfo(r.RequestURI)
	if lik.RegExCompare(r.RequestURI, "\\.(js|css|htm|html|ico|gif|png|jpg|mp3|mp4|mpg|avi)") {
		likapi.ProbeRouteFile(w, r, r.RequestURI)
		return
	}
	var page *front.DataPage
	if sp := lik.StrToInt(likapi.GetParm(r, "_sp")); sp > 0 {
		if pager := likapi.FindPage(sp); pager != nil {
			page = pager.(front.DataPager).GetItPage()
		}
	}
	if page == nil {
		page = front.StartPage()
	} else if lik.StrToInt(likapi.GetParm(r, "_tp")) > 0 {
		page = front.ClonePage(page)
	}
	rule := front.BuildRule(page)
	rule.LoadRequest(r)
	if !lik.RegExCompare(r.RequestURI, "marshal") {
		lik.SayInfo(r.RequestURI)
	}
	if rule.IsShift("api") {
		json := rule.ApiExecute()
		likapi.RouteCookies(w, rule.GetAllCookies())
		likapi.RouteJson(w, 200, json, false)
	} else if rule.IsShift("front") {
		json := rule.Execute()
		likapi.RouteCookies(w, rule.GetAllCookies())
		likapi.RouteJson(w, 200, json, false)
	} else {
		html := rule.ShowPage()
		likapi.RouteCookies(w, rule.GetAllCookies())
		likapi.RouteHtml(w, 200, html.ToString())
	}
}

