import * as core from './core.js';

const ce = React.createElement;

export class ElmAddress extends core.ElmStack {
    main = 'address';

    constructor(props) {
        super({ main: "address", ...props });
        this.build();
    }

    build() {
    }

    buildMenu() {
        return [
            { mode: 'root', title: 'Рут'},
            { mode: 'address', title: 'Адреса'},
            { mode: 'makar', title: 'Макар'},
        ];
    }

    showBody() {
        if (this.isLeaf()) {
            return ce("div", null, this.showCommon());
        } else {
            return super.showInfo();
        }
    }

    showCommon() {
        if (this.dias || true) {
            return this.showCommonMap()
        } else {
            core.getListServer('IPZone', function(list) {
                this.dias = list;
            });
            return 'Loading...';
        }
    }

    showCommonMap() {
        let left = [];
        let leftSize = 0;
        let right = [];
        let rightSize = 0;
        const listDia = [["192168000000",24], ["192168230000",24], ["192168231000",26], ["192168232000",27], ["192168233000",28]];
        for (const dia of listDia) {
            let addr = dia[0];
            let bits = dia[1];
            if (bits < 24) bits = 24;
            else if (bits > 32) bits = 32;
            let volume = 1 << (32-bits);
            let nline = Math.ceil(volume / 16);
            const sho = this.showDia(addr, volume);
            if (leftSize <= rightSize) {
                left.push(sho);
                leftSize += 1 + nline;
            } else {
                right.push(sho);
                rightSize += 1 + nline;
            }
        }
        return ce("table", { className: "page" },
            ce("tbody", null, ce("tr", null,
                ce("td", { className: "column" }, ...left),
                ce("td", { className: "column" }, ...right),
            )),
        )
    }

    showDia(address, volume) {
        let title = 'Адреса ' + core.ipToShow(address);
        let body = 'Объем: ' + core.ipFromShow(core.ipToShow(address));
        let props = { cls: "wide", title: title, body: body };
        return ce(core.WindowBox, props);
    }
}

