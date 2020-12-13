//import * as react from '../lib/react.js';

export const ce = React.createElement;
export const stackElms = [];

export class ElmStack extends React.Component {
    main = null;
    elmMenu = null;
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
        this.elmMenu = this.showMenu();
        if (this.elmMenu) {
            content.push(ce("thead", {key: "head"},
                ce("tr", null, ce("td", null, this.elmMenu))
            ));
        }
        this.elmBody = this.showBody();
        if (this.elmBody) {
            content.push(ce("tbody", {key: "body"},
                ce("tr", null, ce("td", null, this.elmBody))
            ));
        }
        return ce("table", { className: "page" }, content);
    }

    showMenu() {
        const props = {
            level: this.props.level,
            mode: this.state.mode,
        };
        return ce(ElmStackMenu, props)
    }

    showBody() {
        return null;
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

    setPath(path) {
        let state = { mode: this.state.mode, path: this.state.path };
        const loc = this.toPath(path);
        if (state.mode != loc.mode || state.path != loc.path) {
            state.mode = loc.mode;
            state.path = loc.path;
            this.setState(state);
        }
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
                let title = item.title;
                if (item.cmd) {
                    //options.onClick = (e) => this.setCommand(item.cmd);
                    if (item.cmd == this.state.mode) {
                        options.className += ' menusel';
                    }
                    title = ce('a', { onClick: (e) => this.setCommand(item.cmd) }, title)
                }
                let td = ce("td", options, title);
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
        //let options = { id: 'menutime', onClick: () => get_data_part('/front/time') };
        //return ce("b", options, "xx:xx")
        return ce(MenuTime)
    }

    showMenuExit() {
        let options = { src: '/images/menuexit.png', onClick: () => this.setCommand('exit') };
        return ce("img", options)
    }
}

export class MenuTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.calc();
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.tick(), 250);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render() {
        let hour = this.state.date.getHours();
        if (hour < 10) hour = '0' + hour;
        let dots = (this.state.dots) ? ':' : ' ';
        let minute = this.state.date.getMinutes();
        if (minute < 10) minute = '0' + minute;
        return ce('b', { className: 'menuTime' }, hour + dots + minute);
    }

    calc() {
        const date = new Date();
        return {
            date: date,
            dots: (date.getSeconds() % 2) == 0,
        };
    }

    tick() {
        this.setState(this.calc());
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

export function getStackElm(level) {
    return stackElms[level];
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
            vp += int3str(match[g]);
        }
        ip = vp;
    }
    return ip;
}

export function int3str(i) {
    if (i < 10) {
        return '00' + i;
    } else if (i < 100) {
        return '0' + i;
    } else {
        return i;
    }
}

