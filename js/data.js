let dataIndex = 0;
let dataTables = {};
let dataReady = false;
let dataUpId = 0;
let dataIPs = {};

class DataTable {
    table = null;
    elmSys = null;
    elmKey = null;

    constructor(table) {
        this.table = table;
        this.elmSys = {};
        this.elmKey = {};
    }
}

export function initialize() {
    dataReady = false;
    dataIndex = 0;
    dataTables = {};
    dataTables['IPZone'] = new DataTable('IPZone');
    dataTables['IP'] = new DataTable('IP');
    dataTables['Ping'] = new DataTable('Ping');
    requestTables();
    if (!dataUpId) {
        dataUpId = setInterval(requestTables, 30000);
    }
}

function requestTables() {
    get_data_proc('/api/marshal/' + dataIndex, updateTables, null);
}

function updateTables(parm, lika) {
    if (lika) {
        for (var key in lika) {
            if (dataTables[key]) {
                updateTableData(dataTables[key], lika[key])
            }
        }
    }
}

function updateTableData(tbl, data) {
    let map = null;
    if (tbl.table == 'IP') {
        map = 'IP';
    } else if (tbl.table == 'Ping') {
        map = 'IP';
    }
    const syss = {};
    const keys = {};
    for (let n = 0; n < data.length; n++) {
        const elm = data[n];
        const sys = elm.SysNum;
        if (sys) {
            syss[sys] = elm;
        }
        if (map) {
            const key = elm[map];
            if (key) {
                if (!keys[key]) {
                    keys[key] = [];
                }
                keys[key].push(elm);
            }
        }
    }
    tbl.elmSys = syss;
    tbl.elmKey = keys;
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
    const datas = dataTables[table];
    if (!datas || !datas.elmSys) return null;
    return datas.elmSys[sys];
}

export function getKey(table, key) {
    const datas = dataTables[table];
    if (!datas || !datas.elmKey) return null;
    return datas.elmKey[key];
}

export const st_exist = 0x1;
export const st_online = 0x2;
export const st_offline = 0x4;
export const st_dynamic = 0x8;

export function getIPStatus(ip) {
    let status = 0;
    const listip = getKey('IP', ip);
    const listping = getKey('Ping', ip);
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

