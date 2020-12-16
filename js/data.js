let dataRegister = {};
let dataIndex = 0;
let dataUpdId = null;

export function initialize() {
    dataRegister = {};
    dataIndex = 0;
    requestUpdate();
    if (!dataUpdId) {
        dataUpdId = setInterval(requestUpdate, 10000);
    }
}

function requestUpdate() {
    get_data_proc('/api/marshal/' + dataIndex, makeUpdate, null);
}

function makeUpdate(parm, lika) {
    if (lika) {
        for (var key in lika) {
            if (key == 'index') {
                dataIndex = lika[key];
            } else if (key == 'register') {
                dataRegister = lika[key];
            }
        }
    }
}

export function getRegister(path) {
    let names = path.split('/');
    let loc = dataRegister;
    for (let p = 0; p < names.length; p++) {
        let name = names[p];
        if (name) {
            let dat = loc[name];
            if (typeof(dat) === 'undefined' || dat === null) return null;
            loc = dat;
        }
    }
    return loc;
}

export function getServerData(path, elm) {
    get_data_proc(path,
        function (elm, lika) {
            if (lika) {
                elm.setServerData(path, lika);
            }
        }, elm);
}

export function getSys(table, sys) {
    return getRegister('/table/' + table + '/' + sys);
}

export function getKey(table, key, val) {
    let tbl = getRegister('/table/' + table);
    if (tbl) {
        for (var sys in tbl) {
            let elm = tbl[sys];
            if (elm && elm[key] == val) {
                return elm;
            }
        }
    }
    return null;
}

export const st_exist = 0x1;
export const st_online = 0x2;
export const st_offline = 0x4;
export const st_dynamic = 0x8;

export function getIPStatus(ip) {
    let status = 0;
    const listip = getKey('IP', 'IP', ip);
    const listping = getKey('Ping', 'IP', ip);
    if (listip && listip.length) {
        status |= st_exist;
        if (listip[0].Roles & 0x1000) {
            status |= st_online;
        }
    }
    if (listping && listping.length) {
        for (let np=0; np < listping.length; np++) {
            if (listping[np].Roles & 0x1000) {
                status |= st_online;
            }
            if (listping[np].TimeOn || listping[np].TimeOff) {
                let bon = (listping[np].TimeOn >= listping[np].TimeOff);
                let last = (bon) ? listping[np].TimeOn : listping[np].TimeOff;
                status |= (bon) ? st_online : st_offline;
                let now = Date.now()/1000;
                let dura = now - last;
                if (dura < 300) status |= st_dynamic;
            }
        }
    }
    return status;
}

