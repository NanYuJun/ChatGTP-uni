<template>
	<view>
		<view style="height: 100rpx" v-if="tabbar.length > 1" />
		<view class="tabbar" v-if="tabbar.length > 1">
			<view class="navigator">
				<view class="navigator-item" v-for="(item, index) in tabbar" :key="item.pagePath"
					@click="switchTab(item.pagePath)">
					<img :src="item.iconPath" class="icon" v-show="tabbarIndex !== index" />
					<img :src="item.selectedIconPath" class="icon" v-show="tabbarIndex === index"/>
					<text :class="['item-text', { 'text-active': tabbarIndex === index }]">{{ item.text }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: mapState({
			// 从state中拿到数据 箭头函数可使代码更简练
			tabbar: state => state.tabbar,
			tabbarIndex: state => state.tabbarIndex,
		}),
		methods: {
			...mapMutations([
				'setTabbarIndex'
			]),
			switchTab(url) {
				let tabbarIndex = this.tabbar.findIndex(item => item.pagePath == url) || 0
				this.setTabbarIndex(tabbarIndex)
				uni.$u.route(url)
			},
		},
	};
</script>

<style>
	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-content: center;
		justify-content: space-between;
		z-index: 999;
		background: var(--bg-gray);
		border-top: 2rpx solid var(--border);
		cursor: pointer;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.navigator {
		display: flex;
		flex: 1;
		justify-content: space-between;
		align-items: center;
	}

	.navigator-item {
		display: flex;
		justify-content: center;
		flex: 1;
		align-items: center;
		flex-direction: column;
		width: 50rpx;
		height: 100%;
	}

	.item-text {
		margin-top: 6rpx;
		color: #777e86;
		font-size: 24rpx;
	}

	.text-active {
		color: #2e92fd !important;
	}

	.icon {
		width: 20px;
		height: 20px;
	}
</style>
