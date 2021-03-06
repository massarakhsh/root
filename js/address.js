import * as core from './core.js';
import * as data from './data.js';

const ce = React.createElement;

export class ElmAddress extends core.ElmStack {
    main = 'address';

    constructor(props) {
        super(props);
    }

    showBody() {
        if (this.state.mode == 'matrix') {
            return ce(BodyAddressMap, {level: this.props.level});
        } else if (this.state.mode == 'list') {
            return ce(BodyAddressMap, {level: this.props.level});
        } else {
            return ce(BodyAddressMap, {level: this.props.level});
        }
    }

    buildMenu() {
        return [
            { cmd: 'matrix', title: 'Матрица'},
            { cmd: 'list', title: 'Список'},
        ];
    }

    setCommand(cmd) {
        if (cmd == 'matrix') {
            this.setPath(cmd);
        } else if (cmd == 'list') {
            this.setPath(cmd);
        }
        return super.setCommand(cmd);
    }

    componentDidMount() {
    }

}

class BodyAddressMap extends React.Component {
    list_zones = null;

    constructor(props) {
        super(props);
    }

    render() {
        if (this.list_zones) {
            return this.showCommonMap();
        } else {
            data.getListZone((zones) => {
                this.list_zones = zones;
                if (zones) {
                    this.forceUpdate();
                }
            });
            return ce('i', null, 'Загрузка ...');
        }
    }

    showCommonMap() {
        let left = [];
        let right = [];
        if (this.list_zones) {
            this.list_zones.sort((prev, next) => {
                if (prev.Bit < next.Bit) return -1;
                if (prev.Bit > next.Bit) return 1;
                if (prev.IP < next.IP) return -1;
                if (prev.IP > next.IP) return 1;
                return 0;
            });
            for (const dia of this.list_zones) {
                if ((dia.Roles&0x4) == 0) {
                    let addr = dia.IP;
                    let bit = dia.Bit;
                    if (bit < 24) bit = 24;
                    else if (bit > 32) bit = 32;
                    const sho = ce(BodyIPZone, { ip: addr, bit: bit })
                    if (/19216823/.test(addr)) {
                        right.push(sho);
                    } else {
                        left.push(sho);
                    }
                }
            }
        }
        return ce("table", { className: "page" },
            ce("tbody", null, ce("tr", null,
                ce("td", { className: "column" }, ...left),
                ce("td", { className: "column" }, ...right),
            )),
        )
    }
}

class BodyIPZone extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const address = this.props.ip;
        const bit = this.props.bit;
        let volume = 1 << (32 - bit);
        let nline = Math.ceil(volume / 16);
        const title = 'Адреса ' + core.ipToShow(address);
        const match = /^(\d\d\d)(\d\d\d)(\d\d\d)(\d\d\d)$/.exec(address);
        const ip13 = match[1] + match[2] +match[3];
        const ip4 = Number(match[4]);
        const ipline = (ip4 - ip4%16) / 16;
        const rows = [];
        for (let nr=0; nr < nline; nr++) {
            const cells = [];
            for (let nc=0; nc < 16; nc++) {
                const ips = ip13 + core.int3str((nr + ipline) * 16 + nc);
                cells.push(ce('td', null, ce(BodyIPElm, { ip: ips })));
            }
            rows.push(ce('tr', null, ...cells));
        }
        let body = ce('table', {className: 'boxaddr'},
            ce('tbody', null, ...rows));
        let props = { cls: "nowide", title: title, body: body };
        return ce(core.WindowBox, props);
    }
}

class BodyIPElm extends React.Component {
    intervalID;

    constructor(props) {
        super(props);
        this.state = { status: 0, mark: false }
    }

    render() {
        let adr = this.props.ip;
        let sets = {};
        const match = /^(\d\d\d)(\d\d\d)(\d\d\d)(\d\d\d)$/.exec(adr);
        if (match) {
            adr = Number(match[4]);
        }
        let cls = 'ipcell';
        let status = this.state.status;
        if (status & data.st_exist) {
            cls += ' ipexist';
        } else if (status & (data.st_online | data.st_offline)) {
            cls += ' ipused';
        }
        if (status & data.st_online) {
            cls += ' ipon';
        } else if (status & data.st_offline) {
            cls += ' ipoff';
        }
        if (this.state.mark) {
            cls += ' ipdyn';
        }
        sets.className = cls;
        return ce('div', sets, adr);
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        data.getIPStatus(this.props.ip, (status) => this.draw(status));
    }

    draw(status) {
        if (status != this.state.status) {
            this.setState({ status: status, mark: false })
        } else if (this.state.mark) {
            this.setState({ status: this.state.status, mark: false  })
        } else if (status & data.st_dynamic) {
            this.setState({ status: this.state.status, mark: true })
        }
    }
}

