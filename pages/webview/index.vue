<template>
	<!-- 小程序跳转网页必备页面 -->
	<view class="webview">
		<web-view :src="url"></web-view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) {
			this.url = e.url || ''
		}
	}
</script>

<style>
</style>
