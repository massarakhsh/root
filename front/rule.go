package front

import (
	"github.com/massarakhsh/lik/likapi"
)

type DataSession struct {
	likapi.DataSession
}

type DataPage struct {
	likapi.DataPage
	Session *DataSession
}

type DataPager interface {
	likapi.DataPager
	GetItPage() *DataPage
}

type DataRule struct {
	likapi.DataDrive
	ItPage    *DataPage
	ItSession *DataSession
}

type DataRuler interface {
	likapi.DataDriver
	GetItPage() *DataPage
}

func StartPage() *DataPage {
	session := &DataSession{}
	page := &DataPage{Session: session}
	page.Self = page
	session.StartToPage(page)
	return page
}

func ClonePage(from *DataPage) *DataPage {
	page := &DataPage{Session: from.Session}
	page.Self = page
	from.ContinueToPage(page)
	return page
}

func BuildRule(page *DataPage) *DataRule {
	rule := &DataRule{ }
	rule.BindPage(page)
	return rule
}

func (page *DataPage) GetItPage() *DataPage {
	return page
}

func (rule *DataRule) GetItPage() *DataPage {
	return rule.ItPage
}

func (rule *DataRule) BindPage(page *DataPage) {
	rule.ItPage = page
	rule.ItSession = page.Session
	rule.Page = page
}

