export const login = (e) => {
  if(e != 401  && uni.getStorageSync("token")){
    return true;
  }
  let config = uni.getStorageSync("config");
  // 小程序 > 公众号 > 用户账号
  // #ifdef MP-WEIXIN
  if (config.miniprogram) {
    return uni.navigateTo({
      url: "/pages/login/index?type=miniprogram",
    });
  }
  // #endif
  // #ifndef MP-WEIXIN
  if (config.offiaccount) {
    return uni.navigateTo({
      url: "/pages/login/index?type=offiaccount",
    });
  }
  if (config.useraccount) {
    return uni.navigateTo({
      url: "/pages/login/index?type=useraccount",
    });
  }
  // #endif
};
