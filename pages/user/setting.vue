<template>
	<n-page title="个人信息" background="#fff">
		<view class="user-setting">
			<view class="form">
				<view class="avatar" style="position: relative;">
					<u-avatar :size="80" border
						:src="$store.state.userInfo.avatar || '/static/user/index_2/notlogin.png'"></u-avatar>
					<image style="position: absolute;height: 40rpx;width: 40rpx;bottom:0rpx;right:40%;"
						@tap="chooseImage" src="/static/user/index_2/edit.png" mode=""></image>
				</view>

				<view class="form-item">
					<view class="form-item-label">
						用户名
					</view>
					<view class="form-item-value">
						<u--input v-model="$store.state.userInfo.nickname" border="none" type="nickname"
							@blur="updateUserInfo"></u--input>
					</view>

				</view>

				<view>
					<!-- #ifdef H5 -->
					<u-button type="success" class="u-m-t-20" @tap="bindWechat"
						v-if="$store.state.loginConfig.offiaccount || $store.state.loginConfig.webWechat">一键绑定微信
					</u-button>
					<!-- #endif -->

				</view>
			</view>


		</view>
	</n-page>
</template>

<script>
	import config from '@/config/request.js'
	import {
		wechatLogin
	} from '@/config/login.js'
	export default {
		data() {
			return {
				fileList: [],
			};
		},

		onLoad(e) {
			if (e.success) {
				uni.showToast({
					title: '绑定成功！',
					icon: 'success'
				})
			}
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(JSON.stringify(res.tempFilePaths));
						uni.uploadFile({
							url: config.baseURL + '/app/base/comm/upload', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								try {
									let res = JSON.parse(uploadFileRes.data)
									this.$store.state.userInfo.avatar = res.data
								} catch (e) {
									uni.showToast({
										title: '上传失败，请联系管理员',
										icon: 'none'
									})
								}


							}
						});
					}
				});
			},
			bindWechat() {
				wechatLogin(this.$store.state.userInfo.id)
			},
			async updateUserInfo() {
				const {
					data
				} = await uni.$u.http.post("/app/user/info/update", {
					...this.$store.state.userInfo
				});
				if (data.code == 1000) {
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					})


				}
			}
		},

	};
</script>
<style lang="scss">
	.user-setting {

		height: 100%;
		margin: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		border-radius: 10rpx;

		.avatar {
			display: flex;
			justify-content: center;
		}

		.form {
			color: var(--font-black);

			&-item {
				align-items: center;
				justify-content: space-between;


				&-value {

					border-bottom: 1px solid $uni-color-primary;
					color: var(--font-black);

					.uni-input-placeholder {
						color: var(--font-black) !important;
					}

					.u-input {
						color: var(--font-black);
						height: 80rpx;
						line-height: 80rpx;

					}
				}
			}
		}
	}
</style>