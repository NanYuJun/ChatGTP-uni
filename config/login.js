export const login = (e) => {
	if (e != 401 && uni.getStorageSync("appToken")) {
		return true;
	}
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
	// #ifdef H5
	if (config.offiaccount) {
		uni.navigateTo({
			url: "/pages/login/index?type=offiaccount",
		});
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
