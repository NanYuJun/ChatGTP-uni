const baseURL = 'http://121.17.248.74:9000/api'

uni.$u.http.setConfig((config) => {
	config.baseURL = baseURL;
	return config
})

uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	
	return config
}, config => { // 可使用async await 做异步操作
	return Promise.reject(config)
})

uni.$u.http.interceptors.response.use((response) => {
	
	return response
}, (response) => {
	
	return Promise.reject(response)
})
