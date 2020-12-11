let dataIndex = 0;
let dataTables = {};
let dataReady = false;
let upId = 0;

class DataTable {
    table = null;
    elms = null;

    constructor(table) {
        this.table = table;
        this.elms = {};
    }
}

export function initialize() {
    dataReady = false;
    dataIndex = 0;
    dataTables = {};
    dataTables['IPZone'] = new DataTable('IPZone');
    dataTables['IP'] = new DataTable('IP');
    dataTables['Unit'] = new DataTable('Unit');
    requestTables();
    if (!upId) {
        upId = setInterval(requestTables, 5000);
    }
}

function requestTables() {
    get_data_proc('/api/marshal/' + dataIndex, updateTables, null);
}

function updateTables(parm, lika) {
    if (lika) {
        for (var key in lika) {
            if (dataTables[key]) {
                var val = lika[key];
            }
        }
    }
}

export function getServerData(path, elm) {
    get_data_proc(path,
        function (elm, lika) {
            if (lika) {
                elm.setServerData(path, lika);
            }
        }, elm);
}

