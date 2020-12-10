package front

import (
	"github.com/massarakhsh/lik/likdom"
)

func (rule *DataRule) ShowPage() likdom.Domer {
	html := likdom.BuildPageHtml()
	if head, _ := html.GetDataTag("head"); head != nil {
		head.BuildItem("title").BuildString("Root")
		head.BuildString("<meta http-equiv=\"Content-Language\" content=\"ru\">")
		head.BuildString("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">")
		head.BuildString("<script type='text/javascript' src='/lib/jquery.js'></script>")
		head.BuildString("<script type='text/javascript' src='/lib/react.js'></script>")
		head.BuildString("<script type='text/javascript' src='/lib/react-dom.js'></script>")
		head.BuildString("<script type='text/javascript' src='/js/lik.js'></script>")
		head.BuildString("<link rel='stylesheet' href='/js/main.css'/>")
	}
	if body, _ := html.GetDataTag("body"); body != nil {
		if script := body.BuildItem("script", "type=module"); script != nil {
			code := "import {script_start} from '/js/main.js';"
			code += "script_start();"
			script.BuildString(code)
		}
		body.BuildDiv("id=root")
	}
	return html
}

