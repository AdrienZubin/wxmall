// pages/home/home.js
import {Theme} from "../../model/theme";
import {Banner} from "../../model/banner";
import {Category} from "../../model/category";
import {Activity} from "../../model/activity";
import {SpuPaging} from "../../model/spu_paging";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        themeA:null,
        bannerB:null,
        grid:[],
        activityD:null,
        themeE:null,
        bannerG:null,
        themeH:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:  async function (options) {
        await this.initAllData();
        await this.initBottomSpuList();
    },

    async initAllData() {
        const theme = new Theme();
        await theme.getThemes();

        const themeA = await theme.getHomeThemeA();
        const bannerB = await Banner.getHomeLocationB();
        const grid = await Category.getHomeLocationC();
        const activityD = await Activity.getHomeLocationD();
        const themeE = await theme.getHomeThemeE();
        let themeESpu = [];
        if(themeE.online){
            const data = await theme.getHomeLocationESpu();
           // console.log(data)
            if(data){
                themeESpu = data.spu_list.slice(0,8);
            }

        }

        const themeF = await theme.getHomeThemeF();
        const bannerG = await Banner.getHomeLocationG();

        const themeH = await theme.getHomeThemeH();



        this.setData({
            themeA,
            bannerB,
            grid,
            activityD,
            themeE,
            themeESpu,
            themeF,
            bannerG,
            themeH
        })
    },

    async initBottomSpuList(){
        const paging = await SpuPaging.getLatestPaging();
        const data = await paging.getMoreData();
        if(!data){
            return;
        }
        wx.lin.renderWaterFlow(data.items);

    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})