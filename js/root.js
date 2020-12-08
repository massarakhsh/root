import {ce} from './core.js';
import * as core from './core.js';
import * as address from './address.js';

export class ElmRoot extends core.ElmStack {
    main = 'root';

    constructor(props) {
        super(props);
    }

    buildMenu() {
        return [
            { cmd: 'root', title: 'Рут'+this.props.level},
            { cmd: 'address', title: 'Адреса'},
        ];
    }

    setCommand(cmd) {
        if (cmd == 'root' || cmd == 'address') {
            this.setPath('/' + cmd);
        }
        return cmd;
    }

    showBody() {
        if (this.state.mode == 'root') {
            return ce(ElmRoot,{ level: this.props.level+1, path: this.state.path });
        } else if (this.state.mode == 'address') {
            return ce(address.ElmAddress, { level: this.props.level+1, path: this.state.path });
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

