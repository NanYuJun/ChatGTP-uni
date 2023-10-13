<template>
	<view class="login">
		<!-- 账号密码登录 -->
		<view class="login-account" v-if="type == 'login'">
			<view class="login-account-header">
				<view class="hello">
					<text>Hi，欢迎使用</text>
				</view>
			</view>
			<view class="login-account-content">
				<view class="login-account-content-tip">手机号</view>
				<input v-model="loginParams.tak_account" type="text" placeholder="请输入手机号"
					placeholder-class="placeholder" />
				<view class="login-account-content-tip">密码</view>
				<input v-model="loginParams.tak_pwd" type="password" placeholder="请输入密码"
					placeholder-class="placeholder" />


				<view class="login-account-content-tip link" @tap="type = 'register'">还没有账号？快去注册吧</view>
				<button type="button" @click="login()">
					登录
				</button>

			</view>
		</view>
		<!-- 注册 -->
		<view class="login-register" v-if="type == 'register'">
			<view class="login-register-header">
				<view class="hello">
					<text>Hi，欢迎注册</text>
				</view>
			</view>
			<view class="login-register-content">

				<view class="login-register-content-tip">手机号</view>
				<input v-model="registerParams.tak_phone" placeholder="请输入手机号" placeholder-class="placeholder" />
				<view class="login-register-content-tip">密码</view>
				<input v-model="registerParams.tak_pwd" type="password" placeholder="请输入密码"
					placeholder-class="placeholder" />
				<view class="login-register-content-tip">重复密码</view>
				<input v-model="registerParams.tak_pwd2" type="password" placeholder="请输入密码"
					placeholder-class="placeholder" />
				<view class="login-register-content-tip">姓名</view>
				<input v-model="registerParams.tak_name" type="text" placeholder="请输入姓名"
					placeholder-class="placeholder" />

				<view class="login-register-content-tip link" @tap="type = 'useraccount'">已有账号，前往登录</view>
				<button type="button" @click="register()">注册</button>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: "login",
				loginParams: {
					tak_account: '',
					tak_pwd: '',
				},
				registerParams: {
					tak_name: '',
					tak_pwd: '',
					tak_pwd2: '',
					tak_phone: '',
					tak_type: '1',
				}

			};
		},


		methods: {

			// 注册
			async register() {
				if (this.registerParams.tak_pwd != this.registerParams.tak_pwd2) {
					uni.showToast({
						title: "两次密码不一致",
						icon: "none",
					});
					return;
				}

				uni.showLoading({
					title: '注册中～',
					mask: true
				})
				try {
					const {
						data
					} = await uni.$u.http.post(
						`/TakInfo/Add_Person_TakInfo?Jsonstr=${JSON.stringify(this.registerParams)}`)
					uni.hideLoading()
					uni.showToast({
						title: data.Message,
						icon: "none",
					});
					this.type = 'login'
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						title: JSON.stringify(e),
						icon: "none",
					});
				}
			},
			// 微信登录
			async login() {
				try {
					uni.showLoading({
						title: '登录中～',
						mask: true
					})
					try {
						const {
							data
						} = await uni.$u.http.get(
							'/TakInfo/GetTakInfoByAccount', {
								params: this.loginParams
							})
						try {
							this.$store.commit('setUserInfo', JSON.parse(data.Data)?.ds?.[0])
							uni.switchTab({
								url:'/pages/index/index'
							})
							uni.showToast({
								title: data.Message,
								icon: "none",
							});
						} catch (e) {
							uni.showToast({
								title: '获取用户信息失败',
								icon: "none",
							});
						}

						uni.hideLoading()


						this.type = 'login'
					} catch (e) {
						uni.hideLoading()
						uni.showToast({
							title: JSON.stringify(e),
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
		height: 100%;
		width: 100%;
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

		&-outher {
			margin-top: 60rpx;
			width: 100%;
			display: flex;
			justify-content: center;

			&-item {
				background-color: green;
				height: 80rpx;
				width: 80rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
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
				padding: 0 25rpx;
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