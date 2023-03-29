<template>
	<view class="share" :class="theme">
		<u-navbar :autoBack="true" leftIconColor="#fff" title="分享赚次数" :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'"
			:safeAreaInsetTop="true" :placeholder="true" titleStyle="color:#fff">
		</u-navbar>
		<!-- #ifdef H5 -->
		<u--image v-if="canvasUrl" :src="canvasUrl" mode="widthFix" width="750px" height="550px"></u--image>
		<view v-else class="u-p-20 url-content">
			<view class="url-input">
				<input v-model="url" type="text" border />
			</view>
			<view class="url-btn">
				<u-button text="复制邀请地址" type="primary" @tap="copy"> </u-button>
			</view>
		</view>
		<mosowe-canvas-image ref="mosoweCanvasComponents" @canvasImage="_canvasImage" :lists="lists" height="750"
			width="750" />
			
			
		
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef H5
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
			let userInfo = uni.getStorageSync('userInfo')
			this.url = `${window.location.origin}?inviterUserId=${userInfo.id}`
			this.lists = [{
					type: 'image',
					content: this.robot.invitationImg,
					width: 375,
					height: 750,
					x: 0,
					y: 0,
				},

				{
					type: 'rect',
					color: '#fff',
					width: 152.5,
					height: 192.5,
					x: 100,
					y: 330,
				},
				{
					type: 'qr',
					content: `${window.location.origin}?inviterUserId=${userInfo.id}`,
					width: 135,
					height: 175,
					x: 110,
					y: 340,
				},

				{
					type: 'text',
					content: this.robot.invitationTitle,
					color: '#fff',
					x: 175,
					y: 600,
					align: 'center',
					size: '20'
				},

			]

			// this.beginCanvas()
			this.$nextTick(() => {
				this.beginCanvas()
			})

		},
		methods: {
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

	// #endif
</script>
<style lang="scss">
	.share {
		height: 100%;
		background: var(--bg);
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
