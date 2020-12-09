import * as core from './core.js';
import * as data from './data.js';

const ce = React.createElement;

export class ElmAddress extends core.ElmStack {
    main = 'address';

    constructor(props) {
        super(props);
    }

    showBody() {
        return ce(BodyAddress, { level: this.props.level });
    }

    buildMenu() {
        return [
            { cmd: 'root', title: 'Рут'},
            { cmd: 'address', title: 'Адреса'},
            { cmd: 'makar', title: 'Макар'},
        ];
    }

    setCommand(cmd) {
        return super.setCommand(cmd);
    }

    componentDidMount() {
    }

}

class BodyAddress extends React.Component {
    listZone = null;

    constructor(props) {
        super(props);
    }

    render() {
        if (this.listZone) {
            return this.showCommonMap();
        } else {
            data.getServerData('/front/list/IPZone', this);
            return ce('i', null, 'Загрузка ...');
        }
    }

    setServerData(path, list) {
        this.listZone = list.answer;
        this.forceUpdate();
    }

    showCommonMap() {
        let left = [];
        let leftSize = 0;
        let right = [];
        let rightSize = 0;
        if (this.listZone) {
            this.listZone.sort((prev, next) => {
                if (prev.Bit < next.Bit) return -1;
                if (prev.Bit > next.Bit) return 1;
                if (prev.IP < next.IP) return -1;
                if (prev.IP > next.IP) return 1;
                return 0;
            });
            for (const dia of this.listZone) {
                if ((dia.Roles&0x4) == 0) {
                    let addr = dia.IP;
                    let bit = dia.Bit;
                    if (bit < 24) bit = 24;
                    else if (bit > 32) bit = 32;
                    let volume = 1 << (32 - bit);
                    let nline = Math.ceil(volume / 16);
                    const sho = ce(BodyIPZone, { ip: addr, bit: bit })
                    if (leftSize <= rightSize) {
                        left.push(sho);
                        leftSize += 1 + nline;
                    } else {
                        right.push(sho);
                        rightSize += 1 + nline;
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
                const ips = (nr + ipline) * 16 + nc;
                cells.push(this.showIP(ip13, ips))
            }
            rows.push(ce('tr', null, ...cells));
        }
        let body = ce('table', {className: 'boxaddr'},
            ce('tbody', null, ...rows));
        let props = { cls: "wide", title: title, body: body };
        return ce(core.WindowBox, props);
    }

    showIP(ip13, ips) {
        return ce('td', null, ips)
    }
}

