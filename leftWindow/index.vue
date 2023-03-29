<template>
	<view class="user" >
		<view class="user-head" @tap="login">
			<!-- <u-avatar :size="60" :src="userInfo.avatar || '/static/userAvatar.jpg'"></u-avatar> -->
			<view class="u-m-l-40 u-w-200 u-flex-1" v-if="isLogin">
				<view>{{ userInfo.nickname }}</view>
				<view class="u-m-t-20 u-font-24 u-content-color">
					{{tips}}
				</view>
			</view>
			<view class="u-m-l-40 u-w-200 u-flex-1" v-else>
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
				<view class="u-m-t-20 u-font-24 " v-if="userInfo.expireTime">{{`到期时间: ${userInfo.expireTime}`
	    }}</view>
				<view class="u-m-t-20 u-font-24 " v-else>会员不限次数</view>
	
			</view>
			<!-- <u-button customStyle="width: 200rpx;" type="primary" shape="circle"
				:text="userInfo.expireTime ? '续费会员' : '开通会员'" @tap="go('pages/cdk/index')"></u-button> -->
		</view>
		<view class="user-vip u-flex u-flex-between u-flex-y-center" v-else @tap="login">
			<view class="user-vip__position--left">
				<view>会员中心</view>
				<view class="u-m-t-20 u-font-24 u-content-color">登录查看会员权益</view>
			</view>
			<!-- <u-button customStyle="width: 200rpx;" type="primary" shape="circle" text="开通会员"></u-button> -->
		</view>
		<view class="u-p-20">
			<!-- <u-cell-group>
				<u-cell :title="item.title" isLink :icon="item.icon" v-for="item in list" :key="item.id"
					@tap="go(item.url)"></u-cell>
			</u-cell-group> -->
		</view>
		<!-- <tabbar ref="tabBar" /> -->
	</view>
</template>

<script>
</script>

<style>
</style>