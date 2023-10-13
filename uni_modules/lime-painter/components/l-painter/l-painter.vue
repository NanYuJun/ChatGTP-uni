<template>
	<view class="lime-painter" ref="limepainter">
		<view v-if="canvasId && size" :style="styles">
			<!-- #ifndef APP-NVUE -->
			<canvas class="lime-painter__canvas" v-if="use2dCanvas" :id="canvasId" type="2d" :style="size"></canvas>
			<canvas class="lime-painter__canvas" v-else :canvas-id="canvasId" :style="size" :id="canvasId"
				:width="boardWidth * dpr" :height="boardHeight * dpr"></canvas>

			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<web-view :style="size" ref="webview"
				src="/uni_modules/lime-painter/hybrid/html/index.html"
				class="lime-painter__canvas" @pagefinish="onPageFinish" @error="onError" @onPostMessage="onMessage">
			</web-view>
			<!-- #endif -->
		</view>
		<slot />
	</view>
</template>

<script>
	import { parent } from '../common/relation'
	import props from './props'
	import {toPx, base64ToPath, pathToBase64, isBase64, sleep, getImageInfo}from './utils';
	//  #ifndef APP-NVUE
	import { canIUseCanvas2d, isPC} from './utils';
	import Painter from './painter';
	// import Painter from '@painter'
	const nvue = {}
	//  #endif
	//  #ifdef APP-NVUE
	import nvue from './nvue'
	//  #endif
	export default {
		name: 'lime-painter',
		mixins: [props, parent('painter'), nvue],
		data() {
			return {
				use2dCanvas: false,
				canvasHeight: 150,
				canvasWidth: null,
				parentWidth: 0,
				inited: false,
				progress: 0,
				firstRender: 0,
				done: false,
				isPC: false,
			};
		},
		computed: {
			styles() {
				return `${this.size}${this.customStyle||''};` + (this.hidden && 'position: fixed; left: 1500rpx;')
			},
			canvasId() {
				return `l-painter${this._ && this._.uid || this._uid}`
			},
			size() {
				if (this.boardWidth && this.boardHeight) {
					return `width:${this.boardWidth}px; height: ${this.boardHeight}px;`;
				}
			},
			dpr() {
				return this.pixelRatio || uni.getSystemInfoSync().pixelRatio;
			},
			boardWidth() {
				const {width = 0} = (this.elements && this.elements.css) || this.elements || this
				const w = toPx(width||this.width)
				return w || Math.max(w, toPx(this.canvasWidth));
			},
			boardHeight() {
				const {height = 0} = (this.elements && this.elements.css) || this.elements || this
				const h = toPx(height||this.height)
				return h || Math.max(h, toPx(this.canvasHeight));
			},
			hasBoard() {
				return this.board && Object.keys(this.board).length
			},
			elements() {
				return this.hasBoard ? this.board : JSON.parse(JSON.stringify(this.el))
			}
		},
		created() {
			this.show = true
			this.use2dCanvas = this.type === '2d' && canIUseCanvas2d()
			// #ifdef MP-WEIXIN
			this.isPC = isPC
			// #endif
			// #ifdef MP-ALIPAY
			const { platform } = uni.getSystemInfoSync();
			this.isPC = /devtools/.test(platform)
			// #endif
		},
		async mounted() {
			await sleep(30)
			await this.getParentWeith()
			this.$nextTick(() => {
				setTimeout(() => {
					this.$watch('elements', this.watchRender, {
						deep: true,
						immediate: true
					});
				}, 30)
			})
		},
		// #ifdef VUE3
		unmounted() {
			this.done = false
			this.inited = false
			this.firstRender = 0
			this.progress = 0
			this.painter = null
			clearTimeout(this.rendertimer)
		},
		// #endif
		// #ifdef VUE2
		destroyed() {
			this.done = false
			this.inited = false
			this.firstRender = 0
			this.progress = 0
			this.painter = null
			clearTimeout(this.rendertimer)
		},
		// #endif
		methods: {
			async watchRender(val, old) {
				if (!val || !val.views || (!this.firstRender ? !val.views.length : !this.firstRender) || !Object.keys(val).length || JSON.stringify(val) == JSON.stringify(old)) return;
				this.firstRender = 1
				this.progress = 0
				this.done = false
				clearTimeout(this.rendertimer)
				this.rendertimer = setTimeout(() => {
					this.render(val);
				}, this.beforeDelay)
			},
			async setFilePath(path, param) {
				let filePath = path
				const {pathType = this.pathType} =  param || this
				if (pathType == 'base64' && !isBase64(path)) {
					filePath = await pathToBase64(path)
				} else if (pathType == 'url' && isBase64(path)) {
					filePath = await base64ToPath(path)
				}
				if (param && param.isEmit) {
					this.$emit('success', filePath);
				}
				return filePath
			},
			async getSize(args) {
				const {width} = args.css || args
				const {height} = args.css || args
				if (!this.size) {
					if (width || height) {
						this.canvasWidth = width || this.canvasWidth
						this.canvasHeight = height || this.canvasHeight
						await sleep(30);
					} else {
						await this.getParentWeith()
					}
				}
			},
			canvasToTempFilePathSync(args) {
				this.stopWatch = this.$watch('done', (v) => {
					if (v) {
						this.canvasToTempFilePath(args)
						this.stopWatch && this.stopWatch()
					}
				}, {
					immediate: true
				})
				
			},
			// #ifndef APP-NVUE
			getParentWeith() {
				return new Promise(resolve => {
					uni.createSelectorQuery()
						.in(this)
						.select(`.lime-painter`)
						.boundingClientRect()
						.exec(res => {
							const {width, height} = res[0]||{}
							this.parentWidth = Math.ceil(width||0)
							this.canvasWidth = this.parentWidth || 300
							this.canvasHeight = height || this.canvasHeight||150
							resolve(res[0])
						})
				})
			},
			async render(args = {}) {
				if(!Object.keys(args).length) {
					return console.error('空对象')
				}
				this.progress = 0
				this.done = false
				await this.getSize(args)
				const ctx = await this.getContext();
				let {
					use2dCanvas,
					boardWidth,
					boardHeight,
					canvas,
					afterDelay
				} = this;
				if (use2dCanvas && !canvas) {
					return Promise.reject(new Error('canvas 没创建'));
				}
				this.boundary = {
					top: 0,
					left: 0,
					width: boardWidth,
					height: boardHeight
				};
				this.painter = null
				if (!this.painter) {
					const {width} = args.css || args
					const {height} = args.css || args
					if(!width && this.parentWidth) {
						Object.assign(args, {width: this.parentWidth})
					}
					const param = {
						context: ctx,
						canvas,
						width: boardWidth,
						height: boardHeight,
						pixelRatio: this.dpr,
						useCORS: this.useCORS,
						createImage: getImageInfo.bind(this),
						performance: this.performance,
						listen: {
							onProgress: (v) => {
								this.progress = v
								this.$emit('progress', v)
							},
							onEffectFail: (err) => {
								this.$emit('faill', err)
							}
						}
					}
					this.painter = new Painter(param)
				} 
				
				// vue3 赋值给data会引起图片无法绘制 
				const { width, height } = await this.painter.source(JSON.parse(JSON.stringify(args)))
				this.boundary.height = this.canvasHeight = height
				this.boundary.width = this.canvasWidth = width
				await sleep(this.sleep);
				await this.painter.render()
				await new Promise(resolve => this.$nextTick(resolve));
				if (!use2dCanvas) {
					await this.canvasDraw();
				}
				if (afterDelay && use2dCanvas) {
					await sleep(afterDelay);
				}
				this.$emit('done');
				this.done = true
				if (this.isCanvasToTempFilePath) {
					this.canvasToTempFilePath()
						.then(res => {
							this.$emit('success', res.tempFilePath)
						})
						.catch(err => {
							this.$emit('fail', new Error(JSON.stringify(err)));
						});
				}
				return Promise.resolve({
					ctx,
					draw: this.painter,
					node: this.node
				});
			},
			canvasDraw(flag = false) {
				return new Promise((resolve, reject) => this.ctx.draw(flag, () => setTimeout(() => resolve(), this
					.afterDelay)));
			},
			async getContext() {
				if (!this.canvasWidth) {
					this.$emit('fail', 'painter no size')
					console.error('[lime-painter]: 给画板或父级设置尺寸')
					return Promise.reject();
				}
				if (this.ctx && this.inited) {
					return Promise.resolve(this.ctx);
				}
				const { type, use2dCanvas, dpr, boardWidth, boardHeight } = this;
				const _getContext = () => {
					return new Promise(resolve => {
						uni.createSelectorQuery()
							.in(this)
							.select(`#${this.canvasId}`)
							.boundingClientRect()
							.exec(res => {
								if (res) {
									const ctx = uni.createCanvasContext(this.canvasId, this);
									if (!this.inited) {
										this.inited = true;
										this.use2dCanvas = false;
										this.canvas = res;
									}
									// #ifdef MP-ALIPAY
									ctx.scale(dpr, dpr);
									// #endif
									this.ctx = ctx
									resolve(this.ctx);
								} else {
									console.error('[lime-painter] no node')
								}
							});
					});
				};
				if (!use2dCanvas) {
					return _getContext();
				}
				return new Promise(resolve => {
					uni.createSelectorQuery()
						.in(this)
						.select(`#${this.canvasId}`)
						.node()
						.exec(res => {
							let {node: canvas} = res && res[0]||{};
							if(canvas) {
								const ctx = canvas.getContext(type);
								if (!this.inited) {
									this.inited = true;
									this.use2dCanvas = true;
									this.canvas = canvas;
								}
								this.ctx = ctx
								resolve(this.ctx);
							} else {
								console.error('[lime-painter]: no size')
							}
						});
				});
			},
			canvasToTempFilePath(args = {}) {
				return new Promise(async (resolve, reject) => {
					const { use2dCanvas, canvasId, dpr, fileType, quality } = this;
					const success = async (res) => {
						try {
							const tempFilePath = await this.setFilePath(res.tempFilePath || res, args)
							const result = Object.assign(res, {tempFilePath})
							args.success && args.success(result)
							resolve(result)
						} catch (e) {
							this.$emit('fail', e)
						}
					}
					
					let { top: y = 0, left: x = 0, width, height } = this.boundary || this;
					let destWidth = width * dpr;
					let destHeight = height * dpr;
					// #ifdef MP-ALIPAY
					width = destWidth;
					height = destHeight;
					// #endif
					
					const copyArgs = Object.assign({
						x,
						y,
						width,
						height,
						destWidth,
						destHeight,
						canvasId,
						fileType,
						quality,
					}, args, {success});
					if(this.isPC || use2dCanvas) {
						copyArgs.canvas = this.canvas
					}
					
					if (use2dCanvas && !this.isPC) {
						try{
							// #ifndef MP-ALIPAY
							const oFilePath = this.canvas.toDataURL(`image/${args.fileType||fileType}`.replace(/pg/, 'peg'), args.quality||quality)
							if(/data:,/.test(oFilePath)) {
								uni.canvasToTempFilePath(copyArgs, this);
							} else {
								const tempFilePath = await this.setFilePath(oFilePath, args)
								args.success && args.success({tempFilePath})
								resolve({tempFilePath})
							}
							// #endif
							// #ifdef MP-ALIPAY
							this.canvas.toTempFilePath(copyArgs)
							// #endif
						}catch(e){
							args.fail && args.fail(e)
							reject(e)
						}
					} else {
						// #ifdef MP-ALIPAY
						my.canvasToTempFilePath(copyArgs);
						// #endif
						// #ifndef MP-ALIPAY
						uni.canvasToTempFilePath(copyArgs, this);
						// #endif
					}
				})
			}
			// #endif
		}
	};
</script>
<style>
	.lime-painter,
	.lime-painter__canvas {
		// #ifndef APP-NVUE
		width: 100%;
		// #endif
		// #ifdef APP-NVUE
		flex: 1;
		// #endif
	}
</style>
