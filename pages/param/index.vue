<template>
	<n-page :title="content.name">
		<view class="param">
			<mp-html :content="content.data"></mp-html>
		</view>
	</n-page>
</template>

<script>
	export default {
		data() {
			return {
				content: "",
			};
		},
		onLoad(e) {
			this.getContent(e.key);
		},
		methods: {
			async getContent(key) {
				const {
					data
				} = await uni.$u.http.get("/app/base/sys/param/data", {
					params: {
						key,
					},
				});
				this.content = data.data;
			},
		},
	};
</script>

<style scoped>
	.param {
		background: var(--white);
		min-height: 100%;
		overflow-y: auto;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
	}
</style>