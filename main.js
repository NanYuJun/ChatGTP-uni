import App from "./App";
// #ifndef VUE3
import Vue from "vue";
import uView from "uview-ui";
Vue.use(uView);

// #ifdef H5
import "./utils/statistics.js";
// #endif

// 防止使用缓存的地方报错
if (uni.getStorageSync("version") != "1.1.0") {
  uni.clearStorageSync();
  uni.setStorageSync("version", "1.1.0");
}

import "./config/route.js";
import "./config/request.js";

import tabbar from "@/components/tabbar.vue";
Vue.component("tabbar", tabbar);

Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
