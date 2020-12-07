import * as core from './core.js';
import * as root from './root.js';

const ce = React.createElement;

export function script_start() {
    ReactDOM.render(
        ce(root.ElmRoot, { level: 0, path: document.location.pathname}),
        document.querySelector('#root')
    );
}

