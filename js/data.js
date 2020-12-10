let DataIndex = 0;
let DataTables = {};
let DataReady = false;

class DataTable {
    table = null;
    elms = null;

    constructor(table) {
        this.table = table;
        this.elms = {};
    }
}

export function initialize() {
    DataReady = false;
    DataIndex = 0;
    DataTables = {};
    DataTables['IPZone'] = new DataTable('IPZone');
    DataTables['IP'] = new DataTable('IP');
    DataTables['Unit'] = new DataTable('Unit');
}

export function getServerData(path, elm) {
    get_data_proc(path,
        function (elm, lika) {
            if (lika) {
                elm.setServerData(path, lika);
            }
        }, elm);
}

