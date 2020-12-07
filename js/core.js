const ce = React.createElement;

export const stackElms = [];

export class ElmStack extends React.Component {
    elmBody = null;

    constructor(props) {
        super(props);
        this.state = {};
        const level = props.level;
        if (level < stackElms.length) {
            stackElms.splice(level, stackElms.length - level);
        }
        if (level == stackElms.length) {
            stackElms.push(this);
        }
        if (props.path) {
            const match = /^\/?([^\/]+)(.*)/.exec(props.path);
            if (match) {
                this.state.mode = match[1];
                this.state.path = match[2];
            }
        }
    }

    render() {
        const content = [];
        if (this.buildMenu()) {
            const props = {
                level: this.props.level,
                mode: this.state.mode,
                doBuildMenu: this.buildMenu,
                doSetMenu: this.setMenu,
            };
            content.push(ce("thead", null,
                ce("tr", null, ce("td", null, ce(ElmStackMenu, props)))
            ));
        }
        this.elmBody = this.showBody();
        if (this.elmBody) {
            content.push(ce("tbody", null, ce("tr", null, ce("td", null, this.elmBody))));
        }
        return ce("table", { className: "page" }, content);
    }

    setPath(path) {
        let loc = {};
        const match = /^\/?([^\/]+)(.*)/.exec(props.path);
        if (match) {
            this.state.mode = match[1];
            this.state.path = match[2];
        }
        return loc;
    }

    buildMenu() {
        return null;
    }

    setMenu(mode) {
        return mode;
    }

    showBody() {
        if (!this.isLeaf()) {
            return stackElms[this.props.level + 1].render();
        }
        return null;
    }

    isLeaf() {
        return this.props.level + 1 >= stackElms.length;
    }

    getPath() {
        let path = (this.props.level > 0) ? stackElms[this.props.level - 1].getPath() + "/" + this.props.main : "";
        if (this.props.level + 1 >= stackElms.length && this.state.mode) {
            path += "/" + this.state.mode;
        }
        return path;
    }
}

export class ElmStackMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mode: props.mode };
    }

    render() {
        const row = [];
        const build = this.props.doBuildMenu;
        if (build) {
            const items = build();
            if (items) {
                for (let item of items) {
                    let options = {className: "menu"};
                    if (item.mode) {
                        options.onClick = (e) => this.selMenu(item.mode);
                        if (item.mode == this.state.mode) {
                            options.className += ' menusel';
                        }
                    }
                    let td = ce("td", options, item.title);
                    row.push(td);
                }
            }
        }
        row.push(ce("td", { width: '100%' }));
        if (this.props.level == 0) {
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

    selMenu(mode) {
        if (this.props.doSetMenu) {
            mode = this.props.doSetMenu(mode);
        }
        this.setState({mode: mode});
    }

    showMenuTime() {
        let options = { id: 'menutime', onClick: () => get_data_part('/front/time') };
        return ce("b", options, "xx:xx")
    }

    showMenuExit() {
        let options = { id: 'menutime', onClick: () => get_data_part('/front/exit') };
        return ce("b", options, "xx:xx")
    }
}

export function getStackPath() {
    return (stackElms.length > 0) ? stackElms[stackElms.length - 1].getPath() : "";
}

export function ipToShow(ip) {
    const match = /^(\d\d\d)(\d\d\d)(\d\d\d)(\d\d\d)$/.exec(ip);
    if (match) {
        ip = Number(match[1]) + '.' + Number(match[2]) + '.' +Number(match[3]) + '.' +Number(match[4]);
    }
    return ip;
}

export function ipFromShow(ip) {
    const match = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(ip);
    if (match) {
        let vp = '';
        for (let g = 1; g <= 4; g++) {
            let p = match[g];
            if (p < 10) {
                vp += '00' + p;
            } else if (p < 100) {
                vp += '0' + p;
            } else if (p <= 255) {
                vp += p;
            } else {
                return ip;
            }
        }
        ip = vp;
    }
    return ip;
}

export class WindowMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mode: '' };
    }

    render() {
    }
}

export class WindowBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cls = 'windowbox';
        if (this.props.cls) {
            cls += ' ' + this.props.cls;
        }
        let title = "";
        if (this.props.title) {
            title = this.props.title;
        }
        let body = "";
        if (this.props.body) {
            body = this.props.body;
        }
        return ce("table", { className: cls },
            ce("thead", null, ce("tr", null, ce("td", null, title))),
            ce("tbody", null, ce("tr", null, ce("td", null, body))),
        )
    }
}

export function getListServer(table, callb) {
    const inter = { answer: table, callb: callb };
    get_data_proc('/front/list/' + table, answerServer, inter);
}

function answerServer(inter, lika) {
    if (lika && lika.answer) {
        inter.callb(lika.answer);
    }
}

