
export function getSys(table, sys) {
    return lik_ref_get('/' + table + '/' + sys);
}

export function getKey(table, key, val) {
    let list = [];
    let tbl = lik_ref_get('/' + table);
    if (tbl) {
        for (var sys in tbl) {
            let elm = tbl[sys];
            if (!elm) {
            } else if (!key) {
                list.push(elm);
            } else if (elm[key] == val) {
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

export function getListZone() {
    return getKey('IPZone');
}

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

