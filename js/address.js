import * as core from './core.js';

const ce = React.createElement;

export class ElmAddress extends core.ElmStack {
    main = 'address';
    listZone = null;

    constructor(props) {
        super(props);
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

    showBody() {
        return ce("div", null, this.showCommon());
    }

    componentDidMount() {

    }

    showCommon() {
        if (this.listZone) {
            return this.showCommonMap();
        } else {
            getListZone(this);
            return 'Loading...';
        }
    }

    storeListZone(list) {
        this.listZone = list;
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
                    const sho = this.showDia(addr, nline, volume);
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

    showDia(address, nline, volume) {
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

export function getListZone(elm) {
    get_data_proc('/front/list/IPZone',
        function (elm, lika) {
            if (lika && lika.answer) {
                elm.storeListZone(lika.answer);
            }
        }, elm);
}


