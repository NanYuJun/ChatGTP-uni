import {
	login
} from '@/config/login.js'

import pages from '@/pages.json'
uni.$u.routeIntercept = function(config, resolve) {
	// 是否是外链
	if (config.url.indexOf('http') > -1) {
		// #ifdef H5
		// 由于uview内部判断第一位是否为/ 如果是外链不需要加/ 所以这里我们再去掉
		let urlArray = config.url.split('')
		urlArray.splice(0, 1)
		config.url = urlArray.join('')
		// end
		window.open(config.url)
		resolve(false)
		// #endif
		// #ifndef H5
		config.url = '/pages/webview/index?url=' + config.url
		// #endif
	}
	// 是否是分享
	// #ifndef H5
	if (config.url.indexOf('/pages/share/index') > -1) {
		config.url = '/pages/param/index?key=share'
	}
	// #endif
	const index = pages.tabBar.list.findIndex(item => '/' + item.pagePath == config.url)
	if (index > -1) {
		config.type = 'switchTab'
		//  #ifdef MP-TOUTIAO
		uni.switchTab({
			url: config.url,

		})
		// #endif
	} else {
		const userInfo = uni.getStorageSync('userInfo')
		config.url = config.url.indexOf('?') > -1 ? `${config.url}&inviterUserId=${userInfo.id}` :
			`${config.url}?inviterUserId=${userInfo.id}`
	}
	//  #ifdef MP-TOUTIAO
	uni.navigateTo({
		url: config.url
	})
	// #endif
	if (login()) {
		resolve(true)
	}
}
