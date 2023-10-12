// pages/home/home.js
import {
	m_home
} from "../../utils/m_home"
// 全局公共数据
const GLD = getApp().globalData;
Page({

	data: {
		/**当前选中年 */
		selectedYearArr: [],
		seconedMonth: 0,
		/**
		 *  **当前选中日历信息**
		 * 
		 *  1.**currentDateToDay 选中天**
		 *  2.currentDateToMonth 选中年
		 */
		currentDate: {},
		// 实时天气的数据
		currentWeather: {},
		// 最近节日的数据
		recentFestival: [],
		// 选择的省市区
		selectedRegion: ['', '平顶山市', '']
	},


	onLoad(options) {
		console.log('@onLoad执行')

		// 初始化
		// 实现日历
		this.calendarImp();
		// 实现日期天气
		this.dateWeatherImp();
		// 实现最近节日
		this.recentFestivalImp();

	},

	/**实现`日历`相关功能 */
	calendarImp() {
		let page = this
		// 1.获取当前日期对象
		const todayObj = m_home.getCurrentDate();
		console.log('开始进行本地是否具有年数据的判断')

		if (page.checkLocalDataOfYear(todayObj.year)) {

			// 获取本地数据
			console.log('本地有该年数据，获取并设置该年数据')
			page.setData({
				selectedYearArr: page.getLocalDataOfYear(todayObj.year),
				"currentDate.tody": todayObj.today
			})
			//  3. (限制:获取到源年数据后可用此方法)根据指定日期设置选中天
			page.getSelectedDay(todayObj.currentDateToDay, () => {
				// onload中第一次使用获取选中天，加一个当天属性(跟我的日历组件-回到今天 功能相关)
				this.setData({
					"currentDate.tody": todayObj.today
				})
			})

		} else {
			console.log('本地没有该年数据，请求数据并将数据保存本地')
			// 2.向服务器获取指定年份数据并加工保存
			page.getSelectedYearArr(todayObj.year, () => {
				// 3. (限制:获取到源年数据后可用此方法)根据指定日期设置选中天
				page.getSelectedDay(todayObj.currentDateToDay, () => {
					// onload中第一次使用获取选中天，加一个当天属性(跟我的日历组件-回到今天 功能相关)
					this.setData({
						"currentDate.tody": todayObj.today
					})
					// 将年数据保存到本地
					m_home.setLocalData("selectedYearArrs", [page.data.selectedYearArr]);
				})
			})
		}
	},
	/**实现`天气`相关功能 */
	dateWeatherImp() {
		//4. 向服务器获取实时天气数据并保存(由于目标接口api不可快速请求，设了个定时器)
		let timer1 = setTimeout(() => {
			this.getCurrentWeather(this.data.selectedRegion);
		}, 1500)
	},
	/**实现`最近节日`相关 */
	recentFestivalImp() {
		// 5.向服务器获取临近节日并保存(由于目标接口api不可快速请求，设了个定时器)
		let timer2 = setTimeout(() => {
			this.getRecentFestival();
		}, 3000)
	},



	/**
	 * 🚩根据指定天获取并设置选中天数据保存在`data`里的`currentDate`中
	 * @param {string} yymmdd 哪天，格式为yy-mm-dd
	 * @param {function} callBack 可选的回调函数(回调函数可选，主要用来设置今天数据或者其他))
	 */
	getSelectedDay(yymmdd, callBack = () => {}) {
		let yymmddArr = yymmdd.split('-')
		let month = parseInt(yymmddArr[1]) //获取月份
		// console.log('@month', month)
		// console.log('@selectedYearArr', this.data.selectedYearArr)
		let targetDay = this.data.selectedYearArr[month - 1].days.find(day => {
			return day.date == yymmdd
		})
		this.setData({
			"currentDate.year": yymmddArr[0],
			"currentDate.selectDayObj": targetDay,
			"currentDate.currentDateToDay": yymmdd,
			"currentDate.currentDateToMonth": `${yymmddArr[0]}-${yymmddArr[1]}`,
		})
		callBack();

	},

	/**
	 * 🚩向服务器获取指定获取指定区域天气数据并设置`data`里`currentWeather`中
	 * @param {string} selectedRegion 哪年
	 */
	getCurrentWeather(selectedRegion) {
		let page = this
		// 设置请求的参数
		const params = {
			app_id: GLD.app_id,
			app_secret: GLD.app_secret
		}
		let res = m_home.wxRequest(GLD.base_weather_url, '/current/' + selectedRegion[1], "get", params)
		res.then(value => {
			page.setData({
				currentWeather: value.data.data
			})
		}, error => m_home.showMsg("请求天气数据失败了"))
	},

	/**
	 * 🚩向服务器获取指定年数据并将数据保存到`data`里`selectedYearArr`中
	 * @param {string | number} year 哪年
	 * @param {function} callBack 获取数据后执行的回调
	 */
	getSelectedYearArr(year, callBack = () => {}) {
		let page = this
		// 设置请求的参数
		const params = {
			ignoreHoliday: GLD.ignoreHoliday,
			app_id: GLD.app_id,
			app_secret: GLD.app_secret
		}
		// 向服务器请求数据，返回promise对象
		let res = m_home.wxRequest(GLD.base_date_url, '/list/year/' + year, "get", params)
		// 收到服务器返回结果后，根据成功与否进行处理
		res.then(value => {
			page.setData({
				// 将服务器成功响应时，对请求的数据再加工后，保存到本地
				selectedYearArr: page.machineSelectedYearArr(value.data.data)
			})
		}, error => m_home.showMsg("请求日期数据失败了")).then(() => callBack()) //执行回调函数

	},


	/**
	 * 🚩向服务器获取并设置临近的一些节日数据
	 */
	getRecentFestival() {
		let page = this
		// 设置请求的参数
		const params = {
			ignoreHoliday: GLD.ignoreHoliday,
			app_id: GLD.app_id,
			app_secret: GLD.app_secret
		}
		let res = m_home.wxRequest(GLD.base_date_url, '/recent/list', 'get', params);
		res.then(value => {
			page.setData({
				recentFestival: value.data.data
			})
		}, error => m_home.showMsg("最近节日数据请求失败"))
	},


	/**
	 * 加工获取到的年数据，返回加工的数据
	 * @param {[]} initYearArr 未加工前的年数据
	 * @return {[]} 加工后的年数据
	 */
	machineSelectedYearArr(initYearArr) {
		for (let i = 0; i < initYearArr.length; i++) {
			// 周数组
			let weeks = []
			// 天对象
			let weekObj = {}
			// 计数
			let n = 0
			// 当前月有几天
			let dayOfMonth = initYearArr[i].days.length
			// 当前月的第一天是周几(1-7)
			let weekDay = initYearArr[i].days[0].weekDay
			// console.log('@weekDay', weekDay)
			// 当前月有几周
			let weekOfMonth = parseInt((dayOfMonth + (weekDay == 7 ? 0 : weekDay)) / 7 + 1)
			// console.log('@weekOfMonth', weekOfMonth)


			// 遍历每月几周
			for (let wi = 0; wi < weekOfMonth; wi++) {
				// 初始化数组
				weeks[wi] = new Array(7)
				// 遍历7天
				for (let j = 0; j < 7; j++) {
					// 当处在第一个七天时，根据当月第一天为周几进行空对象赋值
					if (wi === 0 && j < weekDay && weekDay !== 7) {
						weeks[0][j] = weekObj
						// console.log('@	weeks[0][n]',weeks)
					} else {
						weekObj = initYearArr[i].days[n] === undefined ? {} : initYearArr[i].days[n]
						weekObj.atWeekOfMonth = wi //当前月的哪周(0为第一周)
						weeks[wi][j] = weekObj
						// console.log('@weeks[i][n]',weeks)
						n++
					}
				}
				// console.log('@weeks', weeks)

			}
			// console.log('@initYearArr',initYearArr)
			initYearArr[i].weeks = weeks
			// console.log('@initYearArr',initYearArr)
		}
		return initYearArr
	},


	/**
	 * 检查本地是否有该选中年数据
	 * @param {string | number} year 年份数据
	 * @return {boolean} boolen
	 */
	checkLocalDataOfYear(year) {
		let result = m_home.getLocalDate("selectedYearArrs")
		// console.log('checkLocalDataOfYear@result', result)
		if (result != '') {
			return result.some((ele) => {
				return ele.some((item) => {
					return item.year == year
				})
			})
		} else {
			return false
		}
	},


	/**
	 * 获取本地数据关于选中年
	 * @param {string | number} year 传入年
	 * @return {[]} 本地关于年的数据
	 */
	getLocalDataOfYear(year) {
		console.log('获取本地数据关于年里的getLocalDataYear启动')
		let result = m_home.getLocalDate("selectedYearArrs")
		return result.find(ele => {
			// console.log('find方法启动,ele值为', ele)
			return ele.some(item => {
				return item.year == year
			})
		})
	},

		/**
	* 设置本地数据关于选中年
	 * @param {string | number} newSelectedYear 新的选中年数据
	 * @return {[]} 本地关于年的数据
	 */
	setLocalDataOfYear(newSelectedYear) {
		let result = m_home.getLocalDate("selectedYearArrs")
			// 将年数据保存到本地
			m_home.setLocalData("selectedYearArrs", [...result, newSelectedYear]);
	},


	// 🚩组件间传递数据
	// 接收组件传来天对象的数据的处理函数(选中天功能一部分)
	upSetSelectedDay(e) {
		console.log('upSetSelectedDay:@e', e)
		this.getSelectedDay(e.detail.date)
	},

	/**接收组件传来的月数据的处理函数（选中月展示日历功能一部分） */
	upSetSelectedMonth(e) {
		let page = this
		console.log('upSetSelectedMonth@e', e)
		// 检测年是否变化，如果变化需要从新请求数据
		let oldYear = this.data.currentDate.year;
		let newYear = e.detail.split('-')[0];

		if (newYear == oldYear) {
			this.getSelectedDay(`${e.detail}-01`)
		} else {
			// 本地数据相关
			if (this.checkLocalDataOfYear(newYear)) {
				console.log('本地有该年数据，获取并设置该年数据')
				this.setData({
					selectedYearArr: this.getLocalDataOfYear(newYear)
				})
				// 更新选中数据
				this.getSelectedDay(`${e.detail}-01`)
			} else {
				// 获取并保存指定年数据
				this.getSelectedYearArr(newYear, () => {
					// 更新选中数据					
					this.getSelectedDay(`${e.detail}-01`)
					// 将新的选中年数据保存到本地
					this.setLocalDataOfYear(this.data.selectedYearArr)
				})
			}
		}
	},

	/**接收组件传来的地区数据的处理函数（选中市区、展示市区功能的一部分） */
	upSetSelectedRegion(e) {
		console.log('upSetSelectedRegion@e', e)
		this.setData({
			"selectedRegion": e.detail
		})
		// 从新向服务器请求天气数据
		this.getCurrentWeather(this.data.selectedRegion);
	},

	/**我的日期列表组件内点击回到今天的处理函数 */
	upSetGoToTody(e) {
		console.log('upSetGoToTody@e', e)
		let currentDateObj = m_home.getCurrentDate(); //当前天数据对象
		// 检测年是否变化，如果变化需要从新请求选中对象
		let newYear = currentDateObj.year;
		let oldYear = this.data.currentDate.year;

		if (newYear == oldYear) {
			this.getSelectedDay(currentDateObj.currentDateToDay) //获取并设置当前选中天
		} else {
			if (this.checkLocalDataOfYear(newYear)) {
				console.log('本地有该年数据，获取并设置该年数据')
				this.setData({
					selectedYearArr: this.getLocalDataOfYear(newYear)
				})
				// 更新选中数据
				this.getSelectedDay(currentDateObj.currentDateToDay)
			} else {
				// 获取指定年数据(源)
				this.getSelectedYearArr(newYear, () => {
					// 更新选中数据
					this.getSelectedDay(currentDateObj.currentDateToDay)
					// 将新的选中年数据保存到本地
					this.setLocalDataOfYear(this.data.selectedYearArr)
				})
			}
		}

  },
  goGoodLuck(){
    wx.navigateTo({
      url: '/pages/goodLuck/goodLuck?selectedDateStr='+this.data.currentDate.currentDateToDay ,
    })
  },


})