<template>
	<n-page>
		<view class="user-setting">
			<view class="form">
				<view class="avatar">
					<u-avatar :size="60" border :src="userInfo.avatar || '/static/userAvatar.jpg'"
						@tap="chooseImage"></u-avatar>
				</view>

				<view class="form-item">
					<view class="form-item-label">
						昵称：
					</view>
					<view class="form-item-value">
						<u--input v-model="userInfo.nickname" border="none"></u--input>
					</view>

				</view>

				<view>
					<!-- #ifdef H5 -->
					<u-button type="success" class="u-m-t-20" @tap="bindWechat"
						v-if="$store.state.loginConfig.offiaccount || $store.state.loginConfig.webWechat">一键绑定微信
					</u-button>
					<!-- #endif -->
					<u-button type="primary" class="u-m-t-20" @tap="updateUserInfo">确定 </u-button>
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
				userInfo: {}
			};
		},
		onShow() {
			this.getUserInfo()
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
									this.userInfo.avatar = res.data
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
			async getUserInfo() {
				const {
					data
				} = await uni.$u.http.post("/app/user/info/userInfo");
				if (data.code == 1000) {
					this.userInfo = data.data
					uni.setStorageSync('appUserInfo', this.userInfo)
				}
			},
			bindWechat() {
				wechatLogin(this.userInfo.id)
			},
			async updateUserInfo() {
				const {
					data
				} = await uni.$u.http.post("/app/user/info/update", {
					...this.userInfo
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
		background-color: var(--white);
		border-radius: 10rpx;

		.avatar {
			display: flex;
			justify-content: center;
		}

		.form {
			color:var(--font-black);
			&-item {
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #f5f5f5;

				&-value {
					color:var(--font-black);
					margin-left: 20rpx;
					flex: 1;
					.uni-input-placeholder {
						color:var(--font-black)!important;
					}
					.u-input{
						color:var(--font-black);
						
					}
				}
			}
		}
	}
</style>