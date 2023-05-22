<template>
	<n-page>
		<view class="share" >
			<image class="share-img" mode="widthFix" width="750rpx" height="1000rpx" :src="canvasUrl" ></image>
			<view class="u-p-20 url-content">
				<view class="url-input">
					<textarea v-model="url" type="" border />
				</view>
				<view class="url-btn">
					<u-button text="复制广告语" type="primary" @tap="copy"> </u-button>
				</view>
			</view>
			<mosowe-canvas-image ref="mosoweCanvasComponents" @canvasImage="_canvasImage" :lists="lists" height="1000"
				width="750" />
		</view>
	</n-page>
</template>

<script>
	export default {
		// js
		data() {
			return {
				canvasUrl: '',
				lists: [],
				url:''
			};
		},
		mounted() {
			if (!this.$login()) {
				return
			}
			let userInfo = uni.getStorageSync('appUserInfo')
			this.url = `${this.robot.invitationTitle}${window.location.origin}?inviterUserId=${userInfo.id}`
			this.lists = [{
					type: 'image',
					content: this.robot.invitationImg,
					width: 750,
					height: 1000,
					x: 0,
					y: 0,
				},

				{
					type: 'rect',
					color: '#fff',
					width: 305,
					height: 305,
					x: 200,
					y: 400,
				},
				{
					type: 'qr',
					content: `${window.location.origin}?inviterUserId=${userInfo.id}`,
					width: 270,
					height: 270,
					x: 220,
					y: 420,
				},
			]

			// this.beginCanvas()
			this.$nextTick(() => {
				this.beginCanvas()
			})
		},
		methods: {
			// 复制
			copy(val) {
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title: "复制成功",
							icon: "none",
						});
					},
				});
			},
			beginCanvas() {
				this.$refs.mosoweCanvasComponents.createCanvas();
			},
			_canvasImage(e) {
				this.canvasUrl = e;
			},
			saveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.canvasUrl,
					success: function() {
						console.log('save success');
					}
				});
			}

		}
	}
</script>
<style lang="scss" scoped>
	.share {
		background: var(--bg);
		&-img{
			width: 750rpx;
			height: 1000rpx;
		}
		
		&-button{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
	.url-input {
		background-color: var(--white);
		color: var(--font-black);
		padding: 20rpx;
		margin: 20rpx 0;
	}
</style>
