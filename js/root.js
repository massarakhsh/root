import * as core from './core.js';
import * as address from './address.js';

const ce = React.createElement;

export class ElmRoot extends core.ElmStack {
    main = 'root';

    constructor(props) {
        super(props);
    }

    buildMenu() {
        return [
            { mode: 'root', title: 'Рут'+this.props.level},
            { mode: 'address', title: 'Адреса'},
        ];
    }

    showBody() {
        if (this.state.mode == 'root') {
            return ce(ElmRoot,{ level: this.props.level+1, path: this.state.path });
        } else if (this.state.mode == 'address') {
            return ce(address.ElmAddress, { level: this.level+1, path: this.state.path });
        } else {
            return ce(BodyRoot, null);
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

