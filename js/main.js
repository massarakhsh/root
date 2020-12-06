import * as core from './core.js';
import * as root from './root.js';

const ce = React.createElement;

export function script_start() {
    const elm = new root.ElmRoot(0, null, document.location.pathname);
    ReactDOM.render(
        ce("div", null, elm.render()),
        document.querySelector('#root')
    );
}

