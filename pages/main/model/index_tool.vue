<template>
	<n-page>
	<view class="model" >
		<view class="model-content u-flex u-flex-between">
			<view class="model-content-category" v-for="(item,index) in modelList" :key="index">
				<view class="title">
					{{item.name}}
				</view>
				<view class="model-content-category-models" >
					<view class="model-content-category-models-item" v-for="(subitem,subindex) in item.models" :key="subindex"
					:class="{actived:subitem.id === model.id}" @click="changeModel(subitem)">
						<image :src="subitem.img" mode=""></image>
						<view class="title">
							{{subitem.name}}
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
		},
		methods: {
			async getModules() {
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/model/listByCategory')
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

		&-content {
			display: flex;
			flex-direction: column;

			&-category {
				&>.title{
					color:var(--font-black);
					font-size: 28rpx;
					font-weight: 600;
					line-height: 70rpx;
				}
				&-models {
					background: var(--white);
					display: flex;
					flex-wrap: wrap;
					border-radius: 10rpx;
					padding: 10rpx 0;
					box-sizing: border-box;
					font-size: 24rpx;
					&-item{
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						width: 25%;
						padding: 10rpx 20rpx;
						box-sizing: border-box;
						position: relative;
						
						.title {
							color: var(--font-black);
							text-align: center;
							margin-top: 10rpx;
						}
						
						image {
							width: 60rpx;
							height: 60rpx;
							// border-radius: 50%;
						}
						
						
						
						.isVip {
							position: absolute;
							top: 10rpx;
							right: 50rpx;
							width: 30rpx;
							height: 30rpx;
						}
					}

					

					
				}
			}
		}

	}
</style>
