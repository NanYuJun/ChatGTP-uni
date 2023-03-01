<template>
	<view class="user">
		<view class="user-head">
			<!-- 背景start -->
			<view class="user-head-bg">
				<image src="/static/user/bg.png" mode="widthFix" class="backgroud-image"></image>
			</view>
			<!-- 背景end -->

			<u-avatar :size="60" :scr="userInfo.avatar"></u-avatar>
			<view class="u-m-l-40 u-w-200 u-flex-1" v-if="isLogin">
				<view>{{ userInfo.nickname }}</view>
				<view class="u-m-t-20 u-font-24 u-content-color">{{
            userInfo.expireTime
              ? "会员不限次数"
              : userInfo.frequency == 0
              ? "今日次数已耗尽,请明日再来!"
              : `每日还可提问${userInfo.frequency}次`
          }}
				</view>
			</view>
			<view class="u-m-l-40 u-w-200 u-flex-1" v-else @tap="login">
				<view>登录</view>
				<view class="u-m-t-20 u-font-24 u-content-color">登录即可享受完整体验
				</view>
			</view>
			<view v-if="isLogin">
				<!-- <u-icon name="setting" color="#000" size="20"></u-icon> -->
			</view>
		</view>
		<view class="user-vip u-flex u-flex-between u-flex-y-center" v-if="isLogin">
			<view class="user-vip__position--left">
				<view>会员中心</view>
				<view class="u-m-t-20 u-font-24 ">{{
          userInfo.expireTime
            ? `到期时间: ${userInfo.expireTime}`
            : "会员不限次数"
        }}</view>
			</view>
			<u-button customStyle="width: 200rpx;" type="primary" shape="circle"
				:text="userInfo.expireTime ? '续费会员' : '开通会员'" @tap="go('pages/cdk/index')"></u-button>
		</view>
		<view class="user-vip u-flex u-flex-between u-flex-y-center" v-else @tap="login">
			<view class="user-vip__position--left">
				<view>会员中心</view>
				<view class="u-m-t-20 u-font-24 u-content-color">登录查看会员权益</view>
			</view>
			<u-button customStyle="width: 200rpx;" type="primary" shape="circle" text="开通会员"></u-button>
		</view>
		<view class="u-p-20">
			<u-cell-group>
				<u-cell :title="item.title" isLink :icon="item.icon" v-for="item in list" :key="item.id"
					:url="item.url"></u-cell>
			</u-cell-group>
		</view>
		<tabbar ref="tabBar" />
	</view>
</template>

<script>
	import {
		login
	} from "@/config/login.js";
	export default {
		data() {
			return {
				list: [],
				userInfo:  {},
				isLogin: false,
			};
		},
		onLoad() {
			this.getList();
		},
		onShow() {
			this.getUserInfo()
			this.$nextTick(() => {
				this.$refs.tabBar.setTabbar()
			})
			this.isLogin = uni.getStorageSync("token") ? true : false;
		},
		methods: {
			go(e) {
				uni.$u.route(e);
			},
			async getUserInfo() {
				const {
					data
				} = await uni.$u.http.post("/app/user/info/userInfo");
				if (data.code == 1000) {
					this.userInfo = data.data
				}
			},
			login() {
				login();
			},
			async getList() {
				const {
					data
				} = await uni.$u.http.post("/app/renovation/user/menu/list");
				this.list = data.data;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.user {
		&-head {
			/* 顶部背景图 start */
			padding: 20rpx;
			box-sizing: border-box;
			height: 450rpx;
			display: flex;
			align-items: center;

			&-bg {
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;

				.backgroud-image {
					width: 100%;
					height: 450rpx;
				}
			}

			/* 顶部背景图 end */
		}

		&-vip {
			display: flex;
			margin: 20rpx;
			padding: 20rpx;
			height: 160rpx;
			margin-top: -100rpx;
			border-radius: 20rpx;
			align-items: center;

			background: linear-gradient(-120deg, #3e445a, #31374a, #2b3042, #262b3c);

			&__position--left {
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-left: 20rpx;
				color: #fff;
				width: 500rpx;
			}
		}
	}
</style>
