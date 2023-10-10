<template>
	<view class="n-page" :class="theme" :style="{background: background}">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar v-if="navbarShow && !isWeixin" :title="title || titleText" :leftIconSize="isTabbar ? 0 : 20"
			:autoBack="true" leftIconColor="#fff" :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'"
			:safeAreaInsetTop="true" :placeholder="true" titleStyle="color:#fff">
		</u-navbar>
		<!-- #endif -->
		<view class="n-page__inner">
			<slot />
		</view>
		<tabbar ref="tabBar" v-if="isTabbar" />
	</view>
</template>

<script>
	import pageConfig from '@/pages.json'
	import tabbar from '@/components/tabbar.vue'
	import {
		mapState
	} from 'vuex'
	import {
		isWeixin
	} from '@/utils/utils.js'
	export default {
		data() {
			return {
				isWeixin: isWeixin()
			}
		},
		props: {
			navbarShow: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: ''
			}
		},
		components: {
			tabbar
		},
		computed: {
			...mapState({
				theme: state => state.theme,
				tabbar: state => state.tabbar,
				pageLoading: state => state.pageLoading,
				model: state => state.model
			}),
			// 页面标题
			titleText() {
				let pages = getCurrentPages()
				let page = pages[pages.length - 1]
				// 对话页面显示模型标题
				if (uni.$u.page() == '/pages/main/chat/index') {
					return this.$store.state.model.name
				}
				// #ifdef H5
				return page?.$holder?.navigationBarTitleText || ''
				// #endif
				// #ifndef H5
				return pageConfig.pages.filter(item => uni.$u.page() == '/' + item.path)?.[0]?.style
					?.navigationBarTitleText ||
					''
				// #endif
			},
			// 是否是tabbar页面
			isTabbar() {
				let pages = getCurrentPages() // 获取栈实例
				let route = pages[pages.length - 1].route; // 获取当前页面路由
				return this.$store.state.tabbar.filter(item => item.pagePath === '/' + route).length > 0
			},
		}
	}
</script>

<style lang="scss">
	.n-page {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		&__inner {
			height: 100%;
			width: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: auto;
			box-sizing: border-box;
		}

	}
</style>