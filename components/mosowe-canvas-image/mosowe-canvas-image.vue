<!-- mosowe-canvas-image -->
<template>
  <view class='mosowe-canvas-image'>
		<view class="slot-view" @click="createCanvas">
			<slot></slot>
		</view>
		<view class="canvas-wrap-box">
			<!-- 主面板绘制 -->
			<canvas class="canvas-wrap" canvas-id="canvas" :style="'width: '+ width +'px; height: '+ height +'px;'"></canvas>
			<!-- 这个是用来绘制圆形图片的 -->
			<canvas class="canvas-wrap" canvas-id="canvas-arc" :style="'width: '+ canvasArcWidth +'px; height: '+ canvasArcHeight +'px;'"></canvas>
		</view>
	</view>
</template>

<script>
import QR from './wxqrcode.js';
export default {
  name: 'mosowe-canvas-image',
  components: {},
  props: {
		imgType: { // 图片类型
			type: String,
			default: 'jpg',
			validator: () => {
				return ['jpg', 'png'];
			}
		},
		compress: { // 是否开启压缩
			type: Boolean,
			default: false
		},
		compressSize: { // 压缩界限，超过界限压缩，默认2M
			type: [Number, String],
			default: 1024*1024*2
		},
		showPreview: { // 生成图像后是否预览
			type: Boolean,
			default: false
		},
	  height: { // canvas高度
			type: [String, Number],
			default: 200
		},
	  width: { // canvas宽度
			type: [String, Number],
			default: 200
		},
		lists: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
  data () {
    return {
			canvas: null,
			listsIndex: 0,
			listsLength: 0,
			canvasArc: null,
			canvasArcWidth: 100,
			canvasArcHeight: 100,
			compressQuality: 20,
			compressQualityH5: 5,
    };
  },
	watch: {},
  // 组件实例化之前 
  beforeCreate () {},
  // 组件创建完成
  created () {
		this.canvas = uni.createCanvasContext('canvas', this);
		this.canvasArc = uni.createCanvasContext('canvas-arc', this);
	},
  // 组件挂载之前
  beforeMount () {},
  // 组件挂载之后
  mounted () {},
  // 组件数据更新时
  beforeUpdate () {},
  // 组价更新
  updated () {},
  // 组件销毁前
  beforeDestroy () {},
  // 组件销毁后
  destroyed () {},
  // 页面方法
  methods: {
		// 开始绘制
		createCanvas () {
			this.clearCanvas();
			if (this.lists.length === 0) {
				uni.showToast({
					title: 'lists不能为空',
					icon: 'none'
				});
				return;
			}
			this.listsIndex = 0;
			this.listsLength = this.lists.length - 1;
			
			this.dataDrawCanvas();
		},
		// 数据绘制
		dataDrawCanvas () {
			let item = this.lists[this.listsIndex];
			if (item.type === 'image') { // 图片
				if (item.content.indexOf('https://') > -1) { // https://网络图片
					// #ifndef H5
					// 非H5
					this.downloadImageNotH5(item);
					// #endif
					// #ifdef H5
					// H5
					this.downloadImageH5(item);
					// #endif
				} else { // 本地选择图片
					if (this.compress && item.hasOwnProperty('file') && item.file.size > this.compressSize) { // 大于限制2M压缩
						this.compressImage(item);
					} else {
						if (item.arc) {
							this.drawImageArc(item);
						} else {
							this.drawImage(item);
						}
					}
				}

			} else if (item.type === 'text') { // 文本
				this.drawText(item);
			} else if (item.type === 'rect') { // 矩形（线条）
				this.drawRect(item);
			} else if (item.type === 'arc') { // 圆形
				this.drawArc(item);
			} else if (item.type === 'qr') { // 二维码
				this.drawQR(item);
			}
		},
		// #ifndef H5
		// https图片下载本地并绘制，非H5
		downloadImageNotH5 (item) { 
			uni.downloadFile({
				url: item.content,
				header: {
					'Access-Control-Allow-Origin': '*',
				},
				success: (res) => {
					item.content = res.tempFilePath;
					if (item.arc) {
						this.drawImageArc(item);
					} else {
						this.drawImage(item);
					}
				},
				fail: (res) => {
					console.log(res);
				}
			});
		},
		// #endif
		// #ifdef H5
		// https图片下载本地并绘制，H5
		downloadImageH5 (item) {
			let image = null;
			image = new Image();
			image.setAttribute('crossOrigin', 'anonymous');
			image.crossOrigin = 'Anonymous';
			image.src = item.content;
			image.onload = () => {
			    let canvas = document.createElement('canvas');
			    canvas.width = item.width;
			    canvas.height = item.height;
			    let ctx = canvas.getContext('2d');
					ctx.drawImage(
						image, 
						0, 
						0, 
						item.width, 
						item.height
					);
			    let dataURL = canvas.toDataURL('image/png');
					if (item.arc) { // 绘制圆形
						item.content = dataURL;
						this.drawImageArc(item);
					} else {
						this.canvas.globalAlpha = item.hasOwnProperty('globalAlpha') ? item.globalAlpha : 1;
						this.canvas.drawImage(
							dataURL, 
							item.x, 
							item.y, 
							item.hasOwnProperty('width') ? item.width : this.width, 
							item.hasOwnProperty('height') ? item.height : this.height
						);

					this.checkDrawOver();						
				}

			};
		},
		// #endif
		// 图片压缩
		compressImage (item) {
			uni.showLoading({
				title: '压缩中...',
				mask: true
			});
			// 非H5压缩
			// #ifndef H5
			uni.compressImage({
				src: item.content,
				quality: this.compressQuality,
				success: (res) => {
					uni.showLoading({
						title: '正在生成图片...',
						mask: true
					});
					item.content = res.tempFilePath;
					if (item.arc) {
						this.drawImageArc(item);
					} else {
						this.drawImage(item);
					}
				},
				fail: (res) => {
					console.log(res);
					uni.showToast({
						title: '压缩失败',
						icon: 'none'
					});
				}
			});
			// #endif
			// H5压缩
			// #ifdef H5
			let image = new Image();
			image.setAttribute('crossOrigin', 'anonymous');
			image.crossOrigin = 'Anonymous';
			image.src = item.content;
			image.onload = () => {
				let canvas = document.createElement('canvas');
				canvas.width = item.width;
				canvas.height = item.height;
				let ctx = canvas.getContext('2d');
				ctx.drawImage(
					image, 
					0, 
					0, 
					item.width, 
					item.height
				);
				let dataURL = canvas.toDataURL('image/png');
				item.content = dataURL;
				if (item.arc) {
					this.drawImageArc(item);
				} else {
					this.drawImage(item);
				}
			};
		 // #endif
		},
		// 圆形图片另外绘制canvas,png格式
		drawImageArc (item) {
			this.canvasArc.clearRect(0, 0, this.canvasArcWidth, this.canvasArcHeight);
			this.canvasArcWidth = item.arcR * 2;
			this.canvasArcHeight = item.arcR * 2;
			this.canvasArc.save();
			let arcT = setTimeout(() => {
				clearTimeout(arcT);
				this.canvasArc.arc(item.arcR, item.arcR, item.arcR, 0, 2 * Math.PI);
				this.canvasArc.clip();
				// this.canvasArc.closePath();
				
				this.canvasArc.drawImage(
					item.content,
					item.arcX,
					item.arcY,
					item.width,
					item.height
				);
				this.canvasArc.draw(false, setTimeout(() => {
					let t = setTimeout(() => {
						clearTimeout(t);
						uni.canvasToTempFilePath({
							x: 0,
							y: 0,
							width: item.arcR * 2,
							height: item.arcR * 2,
							fileType: 'png',
							canvasId: 'canvas-arc',
							success: (res) => {
								item.width = item.arcR * 2;
								item.height = item.arcR * 2;
								item.content = res.tempFilePath;
								this.drawImage(item);
							},
							fail: (res) => {
								console.log(res);
							},
							complete: () => {
								this.canvasArc.restore();
								this.canvasArc.fillRect(0, 0, 0, 0);
								this.canvasArc.clearRect(0, 0, this.canvasArcWidth, this.canvasArcHeight);
							}
						}, this);
					}, 100);
				}));
			}, 100);
		},
		// 图片绘制
		drawImage (item) {
				this.canvas.globalAlpha = item.hasOwnProperty('globalAlpha') ? item.globalAlpha : 1;
				this.canvas.drawImage(
					item.content, 
					item.x, 
					item.y, 
					item.hasOwnProperty('width') ? item.width : this.width, 
					item.hasOwnProperty('height') ? item.height : this.height
				);
				this.checkDrawOver();
		},
		// 文本绘制
		drawText (item) {
				this.canvas.setFillStyle(item.hasOwnProperty('color') ? item.color : '#000000');
				this.canvas.setFontSize(item.hasOwnProperty('size')? item.size : 20);
				this.canvas.setTextAlign(item.hasOwnProperty('align') ? item.align: 'left');
				this.canvas.globalAlpha = item.hasOwnProperty('globalAlpha') ? item.globalAlpha : 1;
				
				if (item.maxWidth) {
					this.canvas.fillText(item.content, item.x, item.y, item.maxWidth);
				} else {
					this.canvas.fillText(item.content, item.x, item.y);
				}
				this.checkDrawOver();
		},
		
		// 矩形（线条）绘制
		drawRect (item) {
			this.canvas.setFillStyle(item.hasOwnProperty('color') ? item.color : '#000000');
			this.canvas.globalAlpha = item.hasOwnProperty('globalAlpha') ? item.globalAlpha : 1;
			this.canvas.fillRect(item.x, item.y, item.width, item.height);
			this.checkDrawOver();
		},
		
		// 圆形绘制
		drawArc (item) {
			this.canvas.arc(item.arcX, item.arcY, item.arcR, 0, 2 * Math.PI);
			this.canvas.setFillStyle(item.hasOwnProperty('color') ? item.color : '#000000');
			this.canvas.globalAlpha = item.hasOwnProperty('globalAlpha') ? item.globalAlpha : 1;
			this.canvas.fill();
			this.canvas.closePath();
			this.checkDrawOver();
		},
		
		// 二维码绘制
		drawQR (item) {
			item['qr'] = QR.createQrCodeImg(item.content, {  
				size: parseInt(300)  
			});
			this.canvas.globalAlpha = item.hasOwnProperty('globalAlpha') ? item.globalAlpha : 1;
			this.canvas.drawImage(
				item.qr, 
				item.x, 
				item.y, 
				item.hasOwnProperty('width') ? item.width : this.width, 
				item.hasOwnProperty('height') ? item.height : this.height
			);
			this.checkDrawOver();
		},
		
		
		// 判断是否绘制完
		checkDrawOver () {
			 if (this.listsIndex < this.listsLength) { // lists未画完
			 	this.listsIndex++;
			 	this.dataDrawCanvas();
			 } else {
			 	this.canvasImage();
			 }
		},
		
		// 绘制到画布并生成图片
		canvasImage () {
			this.listsIndex = 0;
			this.canvas.draw(false, setTimeout(() => {
				setTimeout(() => {
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: Number(this.width),
						height: Number(this.height),
						fileType: this.imgType,
						canvasId: 'canvas',
						success: (res) => {
							this.$emit('canvasImage', res.tempFilePath);
							if (this.showPreview) {
								this.showPreviewFn(res.tempFilePath);
							}
						},
						fail: (res) => {
							console.log(res);
						},
						complete: () => {
							uni.hideLoading();
						}
					}, this);
				}, 500);
			}));
		},
		// 预览图
		showPreviewFn (img) {
			uni.previewImage({
				current: 0,
				urls: [img]
			});
		},
		// 清空画布
		clearCanvas () {
			this.canvas.clearRect(0, 0, this.width, this.height);
		},

	}
};
</script>

<style lang='scss' scoped>
.mosowe-canvas-image{
	overflow: hidden;
	.canvas-wrap-box{
		overflow: hidden;
		height: 0;
		width: 0;
		position: fixed;
		left:200%;
		top: 0;
	}
	.canvas-wrap {
		overflow: hidden;
		height: 0;
		width: 0;
	}
}
</style>