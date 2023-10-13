<template>
	<view class=" chooseImage " style="display: flex;flex-wrap: wrap;">
		<!--#ifdef MP-WEIXIN-->
		<view style="position: relative;" v-for="(item, index) in imgList" :key="index" :style="{ width: size + 'rpx', height: size + 'rpx' }">
			
			<image :src="imgList[index]" :style="{ width: size + 'rpx', height: size + 'rpx' }" @click="viewImg(imgList[index],index)"></image>
			<view class="icon_close " style="position: absolute;" @click="delImg(index)"><i class="iconfont " style="">&#xe635;</i></view>
		</view>
		<view v-if="imgList.length < num" class="text_center" @click="chooseImage">
			<image src="https://www.xyzgy.xyz/image/upload.png" mode="widthFix" :style="{ width: size + 'rpx' }"></image>
		</view>
		<!--#endif-->
		<!--#ifdef APP-PLUS-->
		
		<view style="position: relative;" v-for="(item, index) in arr" :key="index" :style="{ width: size + 'rpx', height: size + 'rpx' }">
			<image :src="arr[index]" :style="{ width: size + 'rpx', height: size + 'rpx' }" @click="viewImg(arr[index],index)"></image>
			<view class="icon_close " style="position: absolute;" @click="delImg(index)"><i class="iconfont " style="">&#xe635;</i></view>
		</view>
		<view v-if="arr.length < num" class="text_center" @click="chooseImage">
			<image src="https://www.xyzgy.xyz/image/upload.png" mode="widthFix" :style="{ width: size + 'rpx' }"></image>
		</view>
		<!--#endif-->
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from './index.js'
	export default {
		props: {
			size: {
				//图片的尺寸
				type: Number,
				default: 200
			},
			num: {
				//上传图片数量
				type: Number,
				default: 9
			},
			isSave: {
				//是否记录用户的选择记录
				type: Boolean,
				default: true
			},
			saveStr: {
				//记录用户的缓存字段
				type: String,
				default: 'chooseImage'
			},
			isBase64: { //是否转base64 受数据传输长度限制，不建议在组件中使用，如果一定要使用，在返回结果中自己转换
				type: Boolean,
				default: true
			},
			imgListprop: {
				type: Array,
				default: () => []
			}
		},

		data() {
			return {
				imgList: [],
				imgListURL:[],
				base64: '',
				arr:[],
				arrURL:[],
				urlList:[]
			};
		},
		watch: {
			imgListprop: function(newVal, oldVal) {
				//#ifdef MP-WEIXIN
				this.imgList = newVal;
				//#endif
				//#ifdef APP-PLUS
				this.arr = newVal;
				//#endif
			}
			// console.log(this.imgListprop)
			// this.imgList=this.imgListprop;
		},
		methods: {
			chooseImage: async function() {
				let _this = this;
				console.log(_this.imgList)
				await _this.getImage();
				
				//this.$emit('chooseImage', _this.imgList);
			},
			getImage() {
				let _this = this;
				let _count = _this.num - _this.imgList.length;

				return new Promise((resolve, reject) => {
					uni.chooseImage({
						count: _count, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], //从相册选择
						success: function(res) {
							console.log(res)
							for(var i =0;i<res.tempFilePaths.length;i++){
								uni.compressImage({
									src: res.tempFilePaths[i],
									quality: 80,
									success: ys => {
										_this.urlList=[];
										if (_this.isBase64) {
											//#ifdef APP-PLUS
											plus.io.resolveLocalFileSystemURL(ys.tempFilePath, function(entry) {
												// 可通过entry对象操作test.html文件 
												entry.file(function(file) {
													var fileReader = new plus.io.FileReader();
													fileReader.readAsDataURL(file); 
													fileReader.onloadend = function(evt) {
														//let base64URL = Buffer.from(evt.target.result).toString("base64");
														let base64 = evt.target.result;
														if (_this.arr.length != 0) {
															_this.arr = _this.arr.concat(base64);
														} else {
															_this.arr = [base64];
														}
														_this.$emit('chooseImage', _this.arr);
													}
												});
											}, function(e) {
												//console.log( "Resolve file URL failed: " + e.message );
											});
								
											//#endif
											//#ifdef MP-WEIXIN
											uni.getFileSystemManager().readFile({
												filePath: ys.tempFilePath, //选择图片返回的相对路径
												encoding: 'base64', //编码格式
												success: function(ress) {
													//成功的回调
													let base64 = 'data:image/jpeg;base64,' + ress.data;
													if (_this.imgList.length != 0) {
														_this.imgList = _this.imgList.concat(base64); 
														_this.imgListURL = _this.imgListURL.concat(res.tempFilePaths);
													} else {
														_this.imgList = [base64];
														_this.imgListURL = res.tempFilePaths;
													}
													_this.$emit('chooseImage', _this.imgList);
												},
												fail: function(err) {
													console.log(err)
												}
											});
											//#endif
											
										} else {
											if (_this.imgList.length != 0) {
												_this.imgList = _this.imgList.concat(res.tempFilePaths);
											} else {
												_this.imgList = res.tempFilePaths;
											}
										}
								
										if (_this.isSave) {
											//#ifdef MP-WEIXIN
											uni.setStorageSync(_this.saveStr, _this.imgList.join(','));
											//#endif
											//#ifdef APP-PLUS
											uni.setStorageSync(_this.saveStr, _this.arr.join(','));
											//#endif
										}
										//#ifdef MP-WEIXIN
										resolve(_this.imgList);
										//#endif
										//#ifdef APP-PLUS
										resolve(_this.arr);
										//#endif
									}
								})
							}
							

						}
					});
				});
			},
			delImg(idx) {
				//#ifdef MP-WEIXIN
				this.imgList.splice(idx, 1);
				this.imgList = this.imgList;
				if (this.isSave) {
					uni.setStorageSync(this.saveStr, this.imgList.join(','));
				}
				this.$emit('delImg', this.imgList);
				//#endif
				//#ifdef APP-PLUS
				this.arr.splice(idx, 1);
				this.arr = this.arr;
				if (this.isSave) {
					uni.setStorageSync(this.saveStr, this.arr.join(','));
				}
				this.$emit('delImg', this.arr);
				//#endif
			},
			async viewImg(path,index) {
				
				//#ifdef APP-PLUS
					if(this.urlList.length!=this.arr.length){
						this.urlList=[];
						uni.showLoading({
							title:'正在拼命加载图片'
						})
						for (var i=0;i<this.arr.length;i++) {
							await base64ToPath(this.arr[i]).then(res => {
								console.log(res)
							    this.urlList.push(res)
							  })
							  .catch(error => { 
							    console.error(error) 
							  })
						}
						uni.hideLoading()
					}
					
					uni.previewImage({
						urls: this.urlList,
						current: index
					});
					
					console.log(index)
				//#endif
				
				//#ifdef MP-WEIXIN
				console.log(this.imgList)
				uni.previewImage({
					urls: this.imgList,
					current: index
				});
				//#endif
				
				
				
			}
		},
		onLoad() {
			//#ifdef MP-WEIXIN
			if (this.isSave) {
				let str = uni.getStorageSync(this.saveStr);
				if (str != '') {
					str = str.split(',');
					if (str.length > this.num) {
						str = str.slice(0, this.num);
					}
					this.imgList = str;
				}
			} else {
				uni.removeStorageSync(this.saveStr);
			}
			//#endif
			//#ifdef MP-WEIXIN
			if (this.isSave) {
				let str = uni.getStorageSync(this.saveStr);
				if (str != '') {
					str = str.split(',');
					if (str.length > this.num) {
						str = str.slice(0, this.num);
					}
					this.arr = str;
				}
			} else {
				uni.removeStorageSync(this.saveStr);
			}
			//#endif
		}
	};
</script>

<style lang="scss" scoped="">
	@font-face {
		font-family: 'iconfont';
		/* project id 1035847 */
		src: url('https://at.alicdn.com/t/font_1035847_ne3azjcnkk.eot');
		src: url('https://at.alicdn.com/t/font_1035847_ne3azjcnkk.eot?#iefix') format('embedded-opentype'), url('https://at.alicdn.com/t/font_1035847_ne3azjcnkk.woff2') format('woff2'),
			url('https://at.alicdn.com/t/font_1035847_ne3azjcnkk.woff') format('woff'), url('https://at.alicdn.com/t/font_1035847_ne3azjcnkk.ttf') format('truetype'),
			url('https://at.alicdn.com/t/font_1035847_ne3azjcnkk.svg#iconfont') format('svg');
	}

	.iconfont {
		font-family: 'iconfont' !important;
		font-size: 20px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
		cursor: pointer;
	}

	.chooseImage {
		background-color: white;
		margin-top: 20rpx;
		// height: 210rpx;
		padding-left: 3%;

		>view {
			margin: 0 20px 20px 0;
		}

		.icon_close {
			width: 20px;
			height: 20px;
			right: -10px;
			top: -10px;

			.iconfont {
				background: #ccc;
				border-radius: 50%;
				padding: 4px;
				font-size: 10px;
			}
		}
	}
</style>
