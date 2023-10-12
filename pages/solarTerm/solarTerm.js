// pages/solarTerm/solarTerm.js
import {solarTermData,holidayData} from "../../utils/m_solarTerm"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		solarTermObj: solarTermData,
		currentIndex: '0',
		holidayData: holidayData
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		
	},
	goSolarDetail(e){
		let selectedSolar = e.currentTarget.dataset.selectedsolar
		console.log(e)
		this.setLocalSelectedSolar(selectedSolar);
		wx.navigateTo({
			url: '/pages/solarDetail/solarDetail'
		})
	},
	setLocalSelectedSolar(selectedSolar){
		wx.setStorageSync('selectedSolarTerm', selectedSolar)
	},

	selectCurrent(e){
		console.log(e)
		this.setData({
			currentIndex:e.currentTarget.dataset.navid
		})
	},
	currentChangeHandle(e){
		console.log('chan',e)
		this.setData({
			currentIndex: e.detail.current
		})
	},

	goHolidayDetail(e){
		let selectedHoliday = e.currentTarget.dataset.selectedholiday
		console.log(e)
		this.setLocalSelectedHoliday(selectedHoliday);
		wx.navigateTo({
			url: '/pages/holidayDetail/holidayDetail'
		})
	},
	setLocalSelectedHoliday(selectedHoliday){
		wx.setStorageSync('selectedHoliday', selectedHoliday)
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})