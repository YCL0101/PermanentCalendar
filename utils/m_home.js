	//  🚩本地数据相关


	let m_home = {
		/**保存本地数据 */
		setLocalData: function (key, val) {
			wx.setStorageSync(key, val)
		},
		
		/**获取本地数据 */
		getLocalDate: function (val) {
			return wx.getStorageSync(val)
		},
		/**promise风请求数据 */
		wxRequest: function (path, url, method, params) {
			return new Promise((resolve, reject) => {
				wx.request({
					url: path + url,
					method: method,
					data: params,
					success: res => resolve(res),
					fail: res => reject(res)
				})
			})
		},
		/**展示提示信息 */
		showMsg: function (title = "某处出错了，触发了showMsg") {
			wx.showToast({
				title: title,
			})
		},

		/** 获取当前日期对象(年、到月、到年、今天) */
		getCurrentDate: function () {
			let date = new Date();
			let year = date.getFullYear(); //当前年
			let month = date.getMonth() + 1; //当前月
			let day = date.getDate(); //当前日
			month = month < 10 ? `0${month}` : month //如果月份小于10，补0
			day = day < 10 ? `0${day}` : day //如果日份小于10，补0
			let currentDateToMonth = `${year}-${month}`;
			let currentDateToDay = `${year}-${month}-${day}`;

			// 封装date日期数据并返回该对象
			return {
				year, // yyyy
				currentDateToMonth, //yyyy-mm
				currentDateToDay, // yyyy-mm-dd 选中天日期
				today: currentDateToDay //今天，值不会改变
			}
		},
	}


	module.exports = {
		m_home
	}