import {Http} from "./http";

class Paging {
    start;   //起始页
    count;   //每页几条
    locker = false;  //锁 是否请求完全
    url;       //请求的url
    req;    //url 请求参数
    moreData=true;  //有没有更多数据
    accumulator = [];  //累加数据组

    /**
     * 初始化数据加载，分页
     * @param req  url data meth
     * @param start
     * @param count
     */
    constructor(req,  count=10,start= 0) {
        this.url = req.url;
        this.start = start;
        this.count = count;
        this.req = req;

    }

    async getMoreData() {
        //没有更多数据
        if(!this.moreData){
            return;
        }
        if (!this._getLocker()) {
            return;
        }
        const data = await this._actualGetData();
        this._releaseLocker();
        return data;
    }

    /**
     * 获取数据
     * @private
     */
    async _actualGetData() {
        const reg = this._getCurrentReq();
        let paging = await Http.request(reg);
        if (!paging) {
            return null;
        }
        //等于0 服务器一条数据没有
        if (paging.total === 0) {
            return {
                empty: true,  //是否空数据 是
                item: [],     //返回列表数据, 无数据
                moreData: false,  //是否最后一页 否
                accumulator: []  //累加数组 之前请求的所有数据
            }
        }
        //判断是否最后一页
        this.moreData = Paging._moreData(paging.total_page, paging.page);
        if (this.moreData) {
            this.start += this.count;
        }
        //累加之前数组
        this._accumulate(paging.items);
        return {
            empty: false,   //是否空数据 不是
            items: paging.items, //返回列表数据
            moreData: this.moreData, //是否最后一页 否
            accumulator: this.accumulator //累加数组 之前请求的所有数据
        }
    }

    /**
     * 拼接数组
     * @param items
     * @private
     */
    _accumulate(items){
        this.accumulator = this.accumulator.concat(items);
    }

    /**
     * 是否最后一页
     * @param totalPage
     * @param pageNum
     * @returns {boolean}
     * @private
     */
    static  _moreData(totalPage, pageNum){
        return pageNum < totalPage-1;
    }

    /**
     * 拼接URL
     * @returns {*}
     * @private
     */
    _getCurrentReq(){
        let url =  this.url;
        const  params = `start=${this.start}&count=${this.count}`;
        if(url.includes('?')){
            url += '&' + params;
        }else {
            url += '?' + params;
        }
        this.req.url = url;
        return this.req;
    }

    /**
     * 锁
     * @returns {boolean}
     * @private
     */
    _getLocker(){
        if(this.locker){
            return false;
        }
        this.locker = true;
        return true;
    }

    /**
     * 解锁
     * @private
     */
    _releaseLocker(){
        this.locker = false;
    }
}

export {
    Paging
}