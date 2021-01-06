export function getServerData(path, elm) {
    get_data_proc(path,
        function (elm, lika) {
            if (lika) {
                elm.setServerData(path, lika);
            }
        }, elm);
}

export function getSys(table, sys) {
    return getRegister('/' + table + '/' + sys);
}

export function getKey(table, key, val) {
    let list = [];
    let tbl = getRegister('/' + table);
    if (tbl) {
        for (var sys in tbl) {
            let elm = tbl[sys];
            if (elm && elm[key] == val) {
                list.push(elm);
            }
        }
    }
    return list;
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
        for (let np=0; np < listip.length; np++) {
            status |= st_exist;
            if (listip[np].Roles & 0x1000) {
                status |= st_online;
            }
            if (listip[np].TimeOn || listip[np].TimeOff) {
                let bon = (listip[np].TimeOn >= listip[np].TimeOff);
                let last = (bon) ? listip[np].TimeOn : listip[np].TimeOff;
                let now = Date.now() / 1000;
                let dura = now - last;
                if (dura < 300) status |= st_dynamic;
            }
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

