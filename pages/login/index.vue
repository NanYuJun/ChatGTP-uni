<template>
	<view class="login" :class="theme">
		 <!-- #ifndef MP-TOUTIAO -->
		<u-navbar title="登录" :autoBack="true" leftIconColor="#fff" :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'" :safeAreaInsetTop="true"
			:placeholder="true" titleStyle="color:#fff">
			</u-navbar>
		<!-- #endif -->
		<!-- 账号密码登录 -->
		<view class="login-account" v-show="type == 'useraccount'">
			<view class="login-account-header">
				<view class="hello">
					<text>Hi，欢迎使用</text>
				</view>
			</view>
			<view class="login-account-content">
				<view class="login-account-content-tip">账号</view>
				<input v-model="nickname" type="text" placeholder="请输入账号" placeholder-class="placeholder" />
				<view class="login-account-content-tip">密码</view>
				<input v-model="password" type="password" placeholder="请输入密码" placeholder-class="placeholder" />
				<view class="login-account-content-tip">验证码</view>
				<view class="login-account-content-captcha">
					<input v-model="captcha" type="text" placeholder="请输入验证码" placeholder-class="placeholder" />
					<image class="captchaImg" :src="captchaImg" @tap="getCaptcha">
				</view>

				<view class="login-account-content-tip link" @tap="type = 'register'">还没有账号？快去注册吧</view>
				<button type="button" @click="login({nickname: nickname,password: password,})">
					登录
				</button>
			</view>
		</view>
		<!-- 注册 -->
		<view class="login-register" v-show="type == 'register'">
			<view class="login-register-header">
				<view class="hello">
					<text>Hi，欢迎注册</text>
				</view>
			</view>
			<view class="login-register-content">
				
				<view class="login-register-content-tip">账号</view>
				<input v-model="nickname" type="text" placeholder="请输入账号" placeholder-class="placeholder" />
				<view class="login-register-content-tip">密码</view>
				<input v-model="password" type="password" placeholder="请输入密码" placeholder-class="placeholder" />
				<view class="login-register-content-tip">重复密码</view>
				<input v-model="passwordV" type="password" placeholder="请输入密码" placeholder-class="placeholder" />
				<view class="login-register-content-tip">邀请人ID</view>
				<input v-model="inviterUserId" type="text" placeholder="非必填" :disabled="disabled"
					placeholder-class="placeholder" />
				<view class="login-register-content-tip">手机号</view>
				<input v-model="phone" placeholder="用于同步平台统一身份信息" placeholder-class="placeholder" />
				<view class="login-register-content-tip link" @tap="type = 'useraccount'">已有账号，前往登录</view>
				<button type="button" @click="register()">注册</button>
			</view>
		</view>
		<!-- 微信小程序登录 -->
		<view class="login-wechat" v-show="type == 'miniprogram'">
			<!-- 内容区域 -->
			<view class="login-wechat__wrapper">
				<view class="login-wechat__sub-img">
					<image src="/static/login.png"></image>
				</view>
				<!-- 标题 -->
				<view class="login-wechat__title">授权登录</view>
				<!-- tips -->
				<view class="login-wechat__sub-title">
					一键授权登录，完整功能体验
				</view>
				<!-- 保存按钮 -->
				<view class="login-wechat__submit-btn" @tap="getLoginCode">
					一 键 登 录
				</view>
			</view>
		</view>
		<!-- 微信授权头像昵称 -->
		<wx-user-info-modal v-model="userInfoShow" :currentUserInfo="userInfo" @updated="updatedUserInfo" />
	</view>
</template>

<script>
	import requestConfig from "@/config/request.js";
	import WxUserInfoModal from "@/uni_modules/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue";

	export default {
		data() {
			return {
				type: "useraccount",
				inviterUserId: "",
				nickname: "",
				password: "",
				phone: "",
				captcha: '',
				passwordV: "",
				disabled: false,
				userInfoShow: false,
				userInfo: {
					avatar: "",
					nickname: "",
				},
				captchaId: '',
				captchaImg: '',

			};
		},
		components: {
			WxUserInfoModal,
		},
		onLoad(e) {
			// #ifdef H5
			this.type = e.type || 'useraccount'; // 默认为账号密码登录
			// #endif
			// #ifdef MP-WEIXIN
			this.type = e.type || 'miniprogram'; // 默认为账号密码登录
			// #endif
			
			
		},
		onShow() {
			this.getCaptcha()
			this.inviterUserId = uni.getStorageSync('inviterUserId') || ''
			// #ifdef H5
			if (this.inviterUserId) {
				this.type = 'register'
			}
			// #endif
		},
		methods: {
			async getCaptcha() {
				this.captcha = ''
				const {
					data
				} = await uni.$u.http.get("/app/base/open/captcha?type=base64&height=30&width=150");
				if (data.code === 1000) {
					this.captchaId = data.data.captchaId
					this.captchaImg = data.data.data
				}
			},
			// 获取code
			getLoginCode() {
				uni.login({
					success: (e) => {
						this.login(e);
					},
				});
			},
			// 注册
			async register() {
				if (this.password != this.passwordV) {
					uni.showToast({
						title: "两次密码不一致",
						icon: "none",
					});
					return;
				}
				if (this.nickname.length > 1) {

				}
				if (!this.phone) {

				}
				uni.showLoading({
					title: '注册中～',
					mask: true
				})
				try {
					const {
						data
					} = await uni.$u.http.post("/app/user/info/register", {
						nickname: this.nickname,
						password: this.password,
						passwordV: this.passwordV,
						inviterUserId: this.inviterUserId || null
					});
					uni.hideLoading()
					if (data.code == 1000) {
						uni.removeStorageSync('inviterUserId')
						this.userInfo = data.data;
						uni.setStorageSync("appToken", data.data.token);
						uni.setStorageSync("userInfo", data.data);
						this.loginBackPage()

					} else {
						uni.showToast({
							title: data.message,
							icon: "none",
						});
					}
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						title: JSON.stringify(e),
						icon: "none",
					});
				}
			},
			// 微信登录
			async login(e) {
				try {
					uni.showLoading({
						title: '登录中～',
						mask: true
					})
					const {
						data
					} = await uni.$u.http.post("/app/user/info/login", {
						...e,
						type: this.type,
						captchaId: this.captchaId,
						captcha: this.captcha,
						inviterUserId: this.inviterUserId,
					});
					uni.hideLoading()
					if (data.code == 1000) {
						this.userInfo = data.data;
						uni.setStorageSync("appToken", data.data.token);
						// #ifdef MP-WEIXIN
						if (!this.userInfo.avatar || !this.userInfo.nickname) {
							return (this.userInfoShow = true);
						}
						// #endif
						uni.setStorageSync("userInfo", data.data);
						this.loginBackPage()
					} else {
						uni.showToast({
							title: data.message,
							icon: "none",
						});
						this.getCaptcha()

					}
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						title: JSON.stringify(e),
						icon: "none",
					});
				}

			},
			uploadAvatar(e) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: requestConfig.baseURL + "/app/base/comm/upload",
						filePath: e.avatar,
						name: "file",
						success: (res) => {
							const fileData = JSON.parse(res.data);
							if (fileData.code == 1000) {
								resolve(fileData.data);
							} else {
								uni.showToast({
									title: "头像上传失败，请重试～",
									icon: "none",
								});
								throw "头像上传失败，请重试～";
							}
						},
					});
				});
			},
			// 退回上一页 如果没有则跳转首页
			loginBackPage() {
				const tabbar = uni.getStorageSync('tabbar')
				uni.switchTab({
					url: tabbar[0].pagePath,
				});
			},
			async updatedUserInfo(e) {
				this.userInfo = {
					...this.userInfo,
					...e,
					avatar: await this.uploadAvatar(e),
				};
				try {
					uni.showLoading({
						title: '登录中～',
						mask: true
					})
					const {
						data
					} = await uni.$u.http.post(
						"/app/user/info/update",
						this.userInfo
					);
					uni.hideLoading()
					if (data.code == 1000) {
						uni.setStorageSync("userInfo", this.userInfo);
						this.loginBackPage()
					} else {
						uni.showToast({
							title: data.message,
							icon: "none",
						});
					}
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						title: JSON.stringify(e),
						icon: "none",
					});
				}

			},
		},
	};
</script>

<style lang="scss">
	.login {
		height:100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: var(--bg);

		&-register {
			&-header {
				padding: 50rpx 0 !important;
			}
		}

		&-account,
		&-register {
			width: 600rpx;

			&-header {
				padding: 0rpx 0 70rpx 0;

				font-weight: bold;

				.hello {
					font-size: 50rpx;
					font-weight: 500;
					display: flex;
					color: var(--black);
					align-items: center;
				}
			}

			&-content {
				input {
					border: 0;
					color: var(--black);
					line-height: 70rpx;
					border-bottom: 1px solid #ccc;
					margin-top: 30rpx;
					padding-bottom: 20rpx;
				}

				.placeholder {
					color: #c0c3cb;
					font-size: 32rpx;
				}

				&-tip {
					font-size: 28rpx;
					margin: 25rpx 0 0 0rpx;
					color: var(--black);

					&.link {
						color: $uni-color-primary;
					}
				}

				&-captcha {
					display: flex;

					.captchaImg {
						background: #000;
						height: 95rpx;
						width: 250rpx;
					}

				}

				button {
					margin-top: 50rpx;
					height: 80rpx;
					background: $uni-color-primary;
					color: #fff;
					border-radius: 45rpx;
					font-size: 32rpx;
					line-height: 80rpx;
				}
			}

			&-footer {}
		}

		&-wechat {
			padding: 0;
			width: 600rpx;

			/* title */
			&__title {
				font-size: 34rpx;
				color: var(--font-black);
			}

			/* sub-title */
			&__sub-title {
				font-size: 26rpx;
				color: #aaaaaa;
				margin-top: 16rpx;
				padding-bottom: 30rpx;
			}

			/* sub-img */
			&__sub-img {
				text-align: center;

				image {
					width: 300rpx;
					height: 300rpx;
				}
			}

			/* 保存按钮 */
			&__submit-btn {
				background-color: $uni-color-primary;
				color: #ffffff;
				margin-top: 30rpx;
				border-radius: 10rpx;
				padding: 25rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				&.disabled {
					background-color: #e6e6e6;
				}
			}
		}
	}
</style>
