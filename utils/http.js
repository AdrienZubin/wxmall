import {config} from "../config/config";
import {promisic} from "./util";

class Http {
    static async request({url, data, method = 'GET'}) {
        const  res = await promisic(wx.request)({
            data,
            "url": `${config.apiBaseUrl}${url}`,
            method,
            "header": {
                "appkey": config.appkey
            }
        })
        return res. data
    }
}

export {
    Http
}