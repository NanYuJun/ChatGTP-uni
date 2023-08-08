<template>
	<n-page title="对话模型">
		<view class="model">
			<view class="model__category">
				<view class="model__category-item u-flex" :class="{
					selected:category === item.id
				}" v-for="(item,index) in categoryList" :key="index" @tap="changeCategory(item.id)">
					{{item.name}}
				</view>
			</view>
			<view class="model-content u-flex u-flex-between">
				<view class="model-content-category" v-for="(item,index) in modelList" :key="index">
					<view class="title">
						{{item.name}}
					</view>
					<view class="model-content-category-models">
						<view class="model-content-category-models-item" v-for="(subitem,subindex) in item.models"
							:key="subindex" :class="{actived:subitem.id === model.id}" @click="changeModel(subitem)">
							<image :src="subitem.img" mode=""></image>
							<view class="title">
								{{subitem.name}}
							</view>
							<view class="desc">
								{{subitem.remarks}}
							</view>
							<image class="isVip" v-show="subitem.isVip" src="/static/is_vip.png">
						</view>


					</view>
				</view>
			</view>

		</view>
	</n-page>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import modelMixins from './model.js'
	export default {
		mixins: [modelMixins],
		data() {
			return {
				category: '',
				categoryList: [],
				modelList: []
			}
		},
		computed: mapState({
			// 从state中拿到数据 箭头函数可使代码更简练
			tabbar: state => state.tabbar,
			robot: state => state.robot,
			model: state => state.model,
		}),
		onLoad() {
			uni.hideTabBar()
			this.getModules()
			this.getCategory()
		},
		methods: {
			changeCategory(id) {
				this.category = id
				this.getModules()
			},
			async getCategory() {
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/model_category/list')
				this.categoryList = [{
						id: '',
						name: 'All'
					},
					...data.data
				]
			},
			async getModules() {
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/model/listByCategory', {
					categoryId: this.category
				})
				this.modelList = data.data
			},
		}
	}
</script>

<style lang="scss">
	.model {
		width: 100%;
		padding: 20rpx;
		height: 100%;
		box-sizing: border-box;
		background: var(--bg);

		&__category {
			overflow-x: auto;
			display: flex;

			&-item {
				cursor: pointer;
				min-width: 150rpx;
				padding: 0 20rpx;
				height: 65rpx;
				border: 4rpx solid $uni-color-primary;
				font-size: 28rpx;
				color: $uni-color-primary;
				margin-right: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 65rpx;

				&.selected {
					background: $uni-color-primary;
					color: #fff;
				}
			}
		}

		&-content {
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;

			&-category {
				&>.title {
					color: var(--font-black);
					font-size: 40rpx;
					font-weight: bolder;
					line-height: 70rpx;
				}

				&-models {
					margin: 30rpx 0;
					overflow-x: auto;
					display: flex;

					&-item {
						border-radius: 30rpx;
						min-width: 310rpx;
						width: 310rpx;
						height: 450rpx;
						border: 4rpx solid var(--bg-gray);
						background: var(--white);
						padding: 30rpx;
						box-sizing: border-box;
						margin-right: 30rpx;
						position: relative;

						.title {
							margin-top: 20rpx;
							color: var(--font-black);
							font-size: 34rpx;
							font-weight: bolder;
						}

						image {
							width: 110rpx;
							height: 110rpx;
							border-radius: 30rpx;
							// border-radius: 50%;
						}

						.desc {
							margin-top: 20rpx;
							font-size: 26rpx;
							color: var(--font-black);
						}



						.isVip {
							position: absolute;
							top: 30rpx;
							right: 20rpx;
							width: 50rpx;
							height: 50rpx;
						}
					}




				}
			}
		}

	}
</style>