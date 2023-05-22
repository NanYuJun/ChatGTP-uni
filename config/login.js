import {
	isWeixin,
	isMobile
} from '@/utils/utils.js'


/*
 ** 检测并跳转登录页面
 ** e 状态 401 为不校验
 */
export const login = (e) => {
	// 校验是否登录
	if (e != 401 && uni.getStorageSync("appToken")) {
		return true;
	}
	uni.removeStorageSync('appToken')
	uni.removeStorageSync('appUserInfo')
	let config = uni.getStorageSync("loginConfig");
	// 小程序 > 公众号 > 用户账号
	// #ifdef MP-WEIXIN
	if (config.miniprogram) {
		uni.navigateTo({
			url: "/pages/login/index?type=miniprogram",
		});
		return false
	}
	// #endif

	// h5 登录
	// #ifdef H5

	// 如果开启公众号登录和账户登录 跳转到账号登录选择微信公众号登录（避免先前用户注册过无法使用）
	if ((config.offiaccount || config.webWechat) && config.useraccount) {
		return uni.navigateTo({
			url: "/pages/login/index?type=useraccount",
		});
		return false
	}
	// 微信登录
	if (config.offiaccount || config.webWechat) {
		wechatLogin()
		return false
	}
	if (config.useraccount) {
		return uni.navigateTo({
			url: "/pages/login/index?type=useraccount",
		});
		return false
	}
	// #endif
};


// 获取用户信息
export const getUserInfo = async () => {
	const {
		data
	} = await uni.$u.http.post("/app/user/info/userInfo");
	s
	uni.setStorageSync('appUserInfo', data.data)
}

// 微信登录
// 在微信内则授权 不在则扫码
export const wechatLogin = (userId) => {
	let config = uni.getStorageSync("loginConfig") || {}
	let inviterUserId = uni.getStorageSync('inviterUserId') || ''
	let webWechatUrl
	let offiaccountUrl
	let urlParams = ''
	
	if(userId && inviterUserId){
		urlParams = `?userId=${userId}&inviterUserId=${inviterUserId}`
	}else if(userId){
		urlParams= `?userId=${userId}`
	}else if(inviterUserId){
		urlParams = `?inviterUserId=${inviterUserId}`
	}
	
	if (config.offiaccount) {
		offiaccountUrl =
			`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.offiaccount.param1}&redirect_uri=${encodeURI(
			`${window.location.origin}/app/user/info/offiaccountLogin${urlParams}`
		)}&response_type=code&scope=snsapi_userinfo&state=STATE&#wechat_redirect`
	}
	if (config.webWechat) {
		webWechatUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${config.webWechat.param1}&redirect_uri=${encodeURI(
			`${window.location.origin}/app/user/info/webWechatLogin${urlParams}`
		)}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`
	}

	if (config.offiaccount && config.webWechat) {
		if (isMobile() || isWeixin()) {
			window.location.href = offiaccountUrl
		} else {
			window.location.href = webWechatUrl
		}
		return
	}
	if (config.offiaccount) {
		window.location.href = offiaccountUrl
		return
	}
	if (config.webWechat) {
		window.location.href = webWechatUrl
		return
	}

	uni.showToast({
		title: '未开启微信登录方式',
		icon: 'none'
	})
}