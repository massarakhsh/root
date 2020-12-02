import * as core from './core.js';
import * as root from './root.js';

const ce = React.createElement;

export function script_start() {
    core.clearStack();
    const elm = new root.ElmRoot(document.location.pathname);
    ReactDOM.render(
        ce("div", null, elm.show()),
        document.querySelector('#root')
    );
}

