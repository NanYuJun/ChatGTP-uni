import {
	login
} from '@/config/login.js'
import store from '@/store/index.js'

uni.$u.routeIntercept = function(config, resolve) {
	// 是否是外链
	if (config.url.indexOf('http') > -1) {
		// 由于uview内部判断第一位是否为/ 如果是外链不需要加/ 所以这里我们再去掉
		let urlArray = config.url.split('')
		urlArray.splice(0, 1)
		config.url = urlArray.join('')
		// end
		// #ifdef H5
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
	// 拼接分享参数直接分享地址可以拿到邀请地址的用户Id
	const userInfo = uni.getStorageSync('appUserInfo') || ''
	if(userInfo){
		config.url = `${config.url}${config.url.indexOf('?') > -1 ? '&' : '?'}inviterUserId=${userInfo.id}`
	}

	// 解决头条和APP不跳转的问题
	//  #ifdef MP-TOUTIAO || APP
	uni.navigateTo({
		url: config.url
	})
	// #endif
	// 是tabbar关闭上一页
	if(store.state.tabbar.some(item => config.url.indexOf(item.pagePath) > -1)){
		config.type = 'redirectTo'
	}
	
	resolve(true)
}
