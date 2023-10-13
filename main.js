import App from "./App";
import Vue from "vue";
import uView from "uview-ui";
Vue.use(uView);
// 全局请求拦截
import "@/config/request.js";

import loadMixin from '@/mixins/load.js'
Vue.mixin(loadMixin)
import commonMixin from '@/mixins/common.js'
Vue.mixin(commonMixin)

Vue.config.productionTip = false;

App.mpType = "app";

import store from './store'
Vue.prototype.$store = store

const app = new Vue({
	store,
	...App,
});

app.$mount();