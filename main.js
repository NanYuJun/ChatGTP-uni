import App from "./App";
import Vue from "vue";

import uView from "uview-ui";
Vue.use(uView);
console.log(uni.$u)

// 全局路由拦截
import "@/config/route.js";
// 全局请求拦截
import "@/config/request.js";

import store from './store'

// 注册全局组件
import nPage from "@/components/n-page";
Vue.component("n-page", nPage);
import wInput from '@/components/watch-login/watch-input.vue' //input
Vue.component('wInput', wInput);
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
	store.dispatch('getUserInfo')
}
// #endif

Vue.prototype.$store = store
Vue.prototype.$login = login

Vue.config.productionTip = false;

App.mpType = "app";

import Chat from '@/utils/chat.js'
Chat.setup()

const app = new Vue({
	store,
	...App,
});

app.$mount();