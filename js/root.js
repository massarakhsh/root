import * as core from './core.js';
import * as address from './address.js';

const ce = React.createElement;

export class ElmRoot extends core.ElmStack {
    constructor(level, props, path) {
        super(level, "root", props, path);
        this.build();
    }

    build() {
        if (this.state.mode == 'root') {
            new ElmRoot(this.level+1, null, this.path);
        } else if (this.state.mode == 'address') {
            new address.ElmAddress(this.level+1, null, this.path);
        }
    }

    buildMenu() {
        return [
            { mode: 'root', title: 'Рут'},
            { mode: 'address', title: 'Адреса'},
        ];
    }

    showBody() {
        if (this.isLeaf()) {
            return ce("div", null, ce(DomRoot));
        } else {
            return super.showBody();
        }
    }
}

class DomRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        return ce("div", { className: "topl" },
            ce("ul", null,
                ce("li", null, "Первое"),
                ce("li", null, ce(WhatLine)),
                ce("li", null, "Третье")
            )
        );
    }
}

export class WhatLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pressed: false };
    }

    render() {
        let prs = this.state.pressed;
        return ce("b", { onClick: () => this.setState({ pressed: !prs }) }, (prs) ? "Да": "Нет");
    }
}

