// #ifdef H5
import wx from 'jweixin-module';
// #endif

import requestConfig from "@/config/request.js";

// wx.config({
// 	debug: false,
// 	appId: data.data.appId,
// 	timestamp: data.data.timeStamp,
// 	nonceStr: data.data.nonceStr,
// 	signature: data.data.paySign,
// 	jsApiList: [
// 		'chooseWXPay' // 需要使用的JS接口列表
// 	]
// })



export const uploadAvatar = (e) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: requestConfig.baseURL + "/app/base/comm/upload",
			filePath: e,
			name: "file",
			success: (res) => {
				
				const fileData = JSON.parse(res.data);
				if (fileData.code == 1000) {
					resolve(fileData.data);
				} else {
					uni.showToast({
						title: "头像上传失败，请重试～",
						icon: "none",
					});
					throw "头像上传失败，请重试～";
				}
			},
		});
	});
}