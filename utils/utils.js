export const delay = async (time) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}


export const isMobile = () => {
	try {
		let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		return flag;
	} catch (e) {
		return false
	}

}


export const isWeixin = () => {
	try {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true
		} else {
			return false
		}
	} catch (e) {
		return false
	}
}