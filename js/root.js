import * as core from './core.js';
import * as address from './address.js';

const ce = React.createElement;

export class ElmRoot extends core.ElmStack {
    constructor(props) {
        super({ main: "root", ...props });
        this.build();
    }

    build() {
        if (this.state.mode == 'root') {
            new ElmRoot({ level: this.props.level+1, path: this.state.path });
        } else if (this.state.mode == 'address') {
            new address.ElmAddress({ level: this.level+1, path: this.state.path});
        }
    }

    buildMenu() {
        return [
            { mode: 'root', title: 'Рут'},
            { mode: 'address', title: 'Адреса'},
        ];
    }

    setMenu(mode) {
        return mode;
    }

    showBody() {
        if (this.isLeaf()) {
            return ce(BodyRoot, null);
        } else {
            return super.showBody();
        }
    }
}

class BodyRoot extends React.Component {
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

