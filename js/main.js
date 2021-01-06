import {ce} from './core.js';
import * as root from './root.js';

export function script_start() {
    lik_ref_initialize();
    ReactDOM.render(
        ce(root.ElmRoot, { level: 0, path: document.location.pathname}),
        document.querySelector('#root')
    );
}

