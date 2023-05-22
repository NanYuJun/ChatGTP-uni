import App from "./App";
import Vue from "vue";
import uView from "uview-ui";
Vue.use(uView);
// 全局路由拦截
import "@/config/route.js";
// 全局请求拦截
import "@/config/request.js";


// 注册全局组件
import nPage from "@/components/n-page";
Vue.component("n-page", nPage);
// end
// 全局mixin
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)
import commonMixin from '@/mixins/common.js'
Vue.mixin(commonMixin)
// end
// 登录逻辑
import {
	login,
	getUserInfo
} from '@/config/login.js'

// #ifdef H5
import "./utils/statistics.js";
// 获取地址栏中的参数
const urlParams = new URLSearchParams(window.location.search);
// 获取参数值
const inviterUserId = urlParams.get('inviterUserId');
uni.setStorageSync('inviterUserId', inviterUserId)
const token = urlParams.get('token');
if (token) {
	uni.setStorageSync('appToken', token)
	getUserInfo()
}
// #endif

Vue.prototype.$login = login

Vue.config.productionTip = false;

App.mpType = "app";

import store from './store'
Vue.prototype.$store = store

import Chat from '@/utils/chat.js'

Chat.setup()

const app = new Vue({
	store,
	...App,
});

app.$mount();