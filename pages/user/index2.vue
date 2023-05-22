<template>
	<n-page>
	<view class="user" >
		<view class="user-head">
			<u-avatar :size="60" :scr="userInfo.avatar"></u-avatar>
			<view class="u-m-l-40 u-w-200 u-flex-1" v-if="isLogin">
				<view class="u-flex nickname">
					<view class="u-font-36">
						{{ userInfo.nickname }}
					</view>
					<image v-if="userInfo.expireTime" class="vip" src="../../static/vip.png" mode=""></image>
					<image v-else class="vip" src="../../static/no_vip.png" mode=""></image>
					
				</view>
				<view class="u-m-t-10 u-font-26">ID: {{ userInfo.id }}</view>
				<view class="u-m-t-10 u-font-24 u-content-color">{{
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
			<view class="u-m-r-40">
				<u-icon name="/static/user/black.png" v-if="theme == 'dark'" color="#000" size="20" @tap="changeTheme('light')"></u-icon>
				<u-icon name="/static/user/white.png" v-if="theme == 'light'" color="#000" size="20"  @tap="changeTheme('dark')"></u-icon>
			</view>
		</view>

		<view class="user-menu u-p-30">
			<u-cell-group :border="false">
				<u-cell :title="item.title" :titleStyle="{'font-size':'30rpx','margin-left':'30rpx'}"
					iconStyle="width:60rpx;height:60rpx" :rightIconStyle="{'display':'none'}" :border="false" isLink
					:icon="item.icon" v-for="item in list" :key="item.id" :url="item.url"></u-cell>
			</u-cell-group>
		</view>
		
	</view>
	</n-page>
</template>

<script>
	import {
		login
	} from "@/config/login.js";
	export default {
		data() {
			return {
				list: [],
				userInfo: {},
				isLogin: false,
			};
		},
		onLoad() {
			this.getList();
		},
		onShow() {
			this.isLogin = uni.getStorageSync("appToken") ? true : false;
			this.isLogin && this.getUserInfo()
		},
		methods: {
			go(e) {
				uni.$u.route(e);
			},
			changeTheme(e){
				this.$store.commit('setTheme',e)
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
		background-color: var(--bg);
		width: 100%;

		&-head {
			/* 顶部背景图 start */
			padding: 20rpx;
			box-sizing: border-box;
			height: 200rpx;
			display: flex;
			align-items: center;
			background-color: var(--bg);
			color: var(--font-black);

			.nickname {
				display: flex;
				align-items: center;
			}

			.vip {
				margin-left: 20rpx;
				width: 30rpx;
				height: 30rpx;
			}

		}

		&-menu {
			/deep/.u-cell {
				background-color: var(--bg-gray);
				margin-bottom: 30rpx;
				.u-cell__title-text{
					color: var(--font-black);
				}
				
			}
		}
	}
</style>
