// components/date-weather/date-weather.js
Component({
    options: {
		styleIsolation: "isolated"
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
        // 日期数据
        currentDate:{
            type: Object,
            default: {}
        },
        // 天气数据
        currentWeather: {
            type: Object,
            default:{}
        }
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
