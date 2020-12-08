export const ce = React.createElement;
export const stackElms = [];

export class ElmStack extends React.Component {
    main = null;
    elmBody = null;

    constructor(props) {
        super(props);
        this.state = this.toPath(props.path);
        const level = props.level;
        if (level < stackElms.length) {
            stackElms.splice(level, stackElms.length - level);
        }
        if (level == stackElms.length) {
            stackElms.push(this);
        }
    }

    render() {
        const content = [];
        if (this.buildMenu()) {
            const props = {
                level: this.props.level,
                mode: this.state.mode,
            };
            content.push(ce("thead", {key: "head"},
                ce("tr", null, ce("td", null, ce(ElmStackMenu, props)))
            ));
        }
        this.elmBody = this.showBody();
        if (this.elmBody) {
            content.push(ce("tbody", {key: "body"},
                ce("tr", null, ce("td", null, this.elmBody))));
        }
        return ce("table", { className: "page" }, content);
    }

    toPath(path) {
        let loc = {};
        if (path) {
            const match = /^\/?([^\/]+)(.*)/.exec(path);
            if (match) {
                loc.mode = match[1];
                loc.path = match[2];
            }
        }
        return loc;
    }

    buildMenu() {
        return null;
    }

    setCommand(cmd) {
        if (cmd == 'exit') {
            if (this.props.level > 0) {
                stackElms[this.props.level - 1].setPath(null);
            } else {
                window.close();
            }
            return null;
        }
        return cmd;
    }

    showBody() {
        if (!this.isLeaf()) {
            return stackElms[this.props.level + 1].render();
        }
        return null;
    }

    setPath(path) {
        let state = { mode: this.state.mode, path: this.state.path };
        const loc = this.toPath(path);
        if (state.mode != loc.mode || state.path != loc.path) {
            state.mode = loc.mode;
            state.path = loc.path;
            this.setState(state);
        }
    }

    isLeaf() {
        return this.props.level + 1 >= stackElms.length;
    }

    getPath() {
        let path = (this.props.level > 0) ? stackElms[this.props.level - 1].getPath() + "/" + this.main : "";
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
        const items = this.getParent().buildMenu();
        if (items) {
            for (let item of items) {
                let options = {className: "menu"};
                if (item.cmd) {
                    options.onClick = (e) => this.setCommand(item.cmd);
                    if (item.cmd == this.state.mode) {
                        options.className += ' menusel';
                    }
                }
                let td = ce("td", options, item.title);
                row.push(td);
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

    getParent() {
        return stackElms[this.props.level];
    }

    setCommand(cmd) {
        const mode = this.getParent().setCommand(cmd);
        if (mode) {
            this.setState({mode: mode});
        }
    }

    showMenuTime() {
        let options = { id: 'menutime', onClick: () => get_data_part('/front/time') };
        return ce("b", options, "xx:xx")
    }

    showMenuExit() {
        let options = { src: '/images/menuexit.png', onClick: () => this.setCommand('exit') };
        return ce("img", options)
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

