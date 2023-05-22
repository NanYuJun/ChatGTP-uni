// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		chat: uni.getStorageSync('chat') || [],
		loginConfig: uni.getStorageSync('loginConfig') || {},
		tabbar: uni.getStorageSync('tabbar') || [],
		tabbarIndex: uni.getStorageSync('tabbarIndex') || 0,
		robot: uni.getStorageSync('robot') || {},
		modelList: uni.getStorageSync('modelList') || [],
		theme: uni.getStorageSync('appTheme') || 'light',
		model: uni.getStorageSync('model') || {},
		chatLoading: false,
	},
	mutations: {
		setChatLoading(state, data) {
			state.chatLoading = data
		},
		setChat(state, data) {
			if (!data) {
				state.chat = []
			} else if (data.index) {
				state.chat[data.index] = data
			} else {
				state.chat.push(data)
			}
			uni.setStorageSync('chat', state.chat)

		},
		setLoginConfig(state, data) {
			state.loginConfig = data
			uni.setStorageSync('loginConfig', data)
		},
		setTheme(state, data) {
			state.theme = data
			uni.setStorageSync('appTheme', data)
		},
		setTabbar(state, data) {
			state.tabbar = data
			uni.setStorageSync('tabbar', data)
		},
		setTabbarIndex(state, data) {
			state.tabbarIndex = data
			uni.setStorageSync('tabbarIndex', data)
		},
		setRobot(state, data) {
			state.robot = data
			uni.setStorageSync('robot', data)
		},
		setModelList(state, data) {
			state.modelList = data
			uni.setStorageSync('modelList', data)
		},
		setModel(state, data) {
			state.model = data
			uni.setStorageSync('model', data)
		},
	}
})
export default store