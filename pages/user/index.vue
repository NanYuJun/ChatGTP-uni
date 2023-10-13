<template>
	<view class="user">
		<view class="user-head">
			<u-avatar :size="60" :src="userInfo.avatar"></u-avatar>
			<view class="u-m-l-40 u-w-200 u-flex-1" v-if="true">
				<view class="nickname n-m-l-20">
					{{userInfo.tak_name}}
				</view>
				<view class="u-m-t-20 u-font-24 u-content-color" v-html="tips"></view>
			</view>
			<view class="u-m-l-40 u-w-200 u-flex-1" v-else>
				<view>登录</view>
				<view class="u-m-t-20 u-font-24 u-content-color">登录即可享受完整体验
				</view>
			</view>

		</view>

		<view class="user-vip u-flex u-flex-between u-flex-y-center">

			<navigator url="/pages/order/index" class="n-flex-1 n-flex n-row-center"
				style="border-right:1px solid #ccc" open-type="switchTab">
				我的订单
			</navigator>
			<navigator url="/pages/message/index" class="n-flex-1 n-flex n-row-center" >
				我的留言
			</navigator>

		</view>

		<view class="u-p-20">
			<u-cell-group>
				<u-cell :title="item.title" isLink v-for="item in [
					{
						title:'咨询中心',
						url:'/pages/order/index'
					},
					
					
				]" :key="item.id" @tap="go(item.url)"></u-cell>
			</u-cell-group>
		</view>
		<view class="n-p-20 n-m-t-30">
			<u-button type="primary" text="退出" @tap="logout"></u-button>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],

				isLogin: false,
				tips: '',
			};
		},
		async onShow() {

			if (!this.$store.state.userInfo?.tak_id) {
				uni.navigateTo({
					url: '/pages/login/index'
				})
				return
			}

		},
		methods: {
			logout() {
				this.$store.commit('setUserInfo', {})
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			go(url) {
				uni.switchTab({
					url: url
				})
			}
		}


	};
</script>

<style lang="scss" scoped>
	.user {
		width: 100%;
		background-image: url('../../static/user/bg.png');
		background-color: #fff;

		background-repeat: no-repeat;
		background-size: 100% 450rpx;

		.nickname {
			display: flex;
			align-items: center;
		}

		.vip {
			margin-left: 20rpx;
			width: 30rpx;
			height: 30rpx;
		}


		&-head {
			/* 顶部背景图 start */
			padding: 20rpx;
			box-sizing: border-box;
			height: 450rpx;
			display: flex;
			align-items: center;
			color: var(--font-black);


		}

		&-vip {
			display: flex;
			margin: 20rpx;
			padding: 20rpx;
			height: 160rpx;
			margin-top: -100rpx;
			border-radius: 20rpx;
			align-items: center;
			background: #fff;

			&__position--left {
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-left: 20rpx;
				color: #fff;
				width: 500rpx;
			}
		}

		/deep/.u-cell__title-text {
			color: var(--font-black)
		}


	}
</style>