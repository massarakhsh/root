import * as core from './core.js';

const ce = React.createElement;

export class ElmAddress extends core.ElmStack {
    main = "address";

    constructor(path) {
        super();
        this.build(path);
    }

    build(path) {
    }

    showInfo() {
        if (this.isLeaf()) {
            return ce("div", null, this.showCommonMap());
        } else {
            return super.showInfo();
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
                ce("td", null, ...left),
                ce("td", null, ...right),
            )),
        )
    }

    showDia(address, volume) {
        return ce("table", { className: "wind" },
            ce("thead", null, ce("tr", null, ce("td", { background: '#ddd' }, address))),
            ce("tbody", null, ce("tr", null, ce("td", null, volume))),
        )
    }
}

class WhatLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pressed: false };
    }

    render() {
        let prs = this.state.pressed;
        return ce("b", { onClick: () => this.setState({ pressed: !prs }) }, (prs) ? "Да": "Нет");
    }
}

