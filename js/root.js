import * as core from './core.js';
import * as address from './address.js';

const ce = React.createElement;

export class ElmRoot extends core.ElmStack {
    main = "root";

    constructor(path) {
        super();
        this.build(path);
    }

    build(path) {
        const match = /^\/([^\/]*)(.*)/.exec(path);
        if (match) {
            const mode = match[1];
            path = match[2];
            if (mode =="address") {
                new address.ElmAddress(path);
            }
        }
    }

    showInfo() {
        if (this.isLeaf()) {
            return ce("div", null, ce(CompRoot));
        } else {
            return super.showInfo();
        }
    }
}

class CompRoot extends React.Component {
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

