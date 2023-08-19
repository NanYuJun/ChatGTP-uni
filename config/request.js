import {
	baseURL
} from './config.js'
import {
	login
} from '@/config/login.js'

uni.$u.http.setConfig((config) => {
	config.baseURL = baseURL;
	return config
})

uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	config.header.Authorization = uni.getStorageSync('appToken')

	return config
}, config => { // 可使用async await 做异步操作
	return Promise.reject(config)
})

uni.$u.http.interceptors.response.use((response) => {
	if (response.statusCode !== 200) {
		return Promise.reject(response)
	}
	return response
}, (response) => {
	// 对响应错误做点什么 （statusCode !== 200）
	console.log(response)
	switch (response.statusCode) {
		case 401:
			login(401)
			break;
		default:
			break;
	}
	return Promise.reject(response)
})