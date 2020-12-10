


export function getServerData(path, elm) {
    get_data_proc(path,
        function (elm, lika) {
            if (lika) {
                elm.setServerData(path, lika);
            }
        }, elm);
}

