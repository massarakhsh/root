import * as core from './core.js';
import * as root from './root.js';

const ce = React.createElement;

export function script_start() {
    const domContainer = document.querySelector('#root');
    core.stackElms.splice(0, core.stackElms.length);
    const elm = new root.ElmRoot(document.location.pathname);
    ReactDOM.render(
        ce("div", null, elm.show()),
        domContainer
    );
}

