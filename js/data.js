
export const st_exist = 0x1;
export const st_online = 0x2;
export const st_offline = 0x4;
export const st_dynamic = 0x8;

export function getListZone(callback) {
    likref_get_keyval('IPZone', null, null, callback);
}

export function getIPStatus(ip, callback) {
    likref_get_keyval('IP', 'IP', ip, (list) => {
        let status = 0;
        if (list) {
            for (let np = 0; np < list.length; np++) {
                let elm = list[np];
                status |= st_exist;
                if (elm.Roles & 0x1000) {
                    status |= st_online;
                }
                if (elm.TimeOn || elm.TimeOff) {
                    let bon = (elm.TimeOn >= elm.TimeOff);
                    let last = (bon) ? elm.TimeOn : elm.TimeOff;
                    let now = Date.now() / 1000;
                    let dura = now - last;
                    if (dura < 300) status |= st_dynamic;
                }
            }
        }
        callback(status);
    });
}

