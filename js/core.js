const ce = React.createElement;

export const stackElms = [];

export class ElmStack {
    level = 0;
    mode = "";

    constructor() {
        this.level = stackElms.length;
        stackElms.push(this);
    }

    show() {
        return ce("table", { className: "page" },
            ce("thead", null, ce("tr", null, ce("td", null, this.showMenu()))),
            ce("tbody", null, ce("tr", null, ce("td", null, this.showInfo()))),
        )
    }

    showMenu() {
        const items = ["Раз", "Два", "Три"];
        let row = [];
        for (let item of items) {
            let options = {className: "menu",
                onClick: () => fun(this)
            };
            let td = ce("td", options, item);
            row.push(td);
        }
        row.push(ce("td", { width: '100%' }));
        if (this.level == 0) {
            row.push(ce("td", null, this.showMenuTime()));
        } else {
            row.push(ce("td", null, this.showMenuExit()));
        }
        return ce("table", { className: "menu" },
            ce("thead", null,
                ce("tr", null, ...row)
            )
        );
    }


    showInfo() {
        if (!this.isLeaf()) {
            return stackElms[this.level + 1].show();
        }
        return null;
    }

    showMenuTime() {
        let options = { id: 'menutime', onClick: () => get_data_part('/front/time') };
        return ce("b", options, "xx:xx")
    }

    showMenuExit() {
        let options = { id: 'menutime', onClick: () => get_data_part('/front/exit') };
        return ce("b", options, "xx:xx")
    }

    isLeaf() {
        return this.level + 1 >= stackElms.length;
    }
}

