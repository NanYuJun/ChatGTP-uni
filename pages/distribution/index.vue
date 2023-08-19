<template>
	<n-page>
		<view class="distribution">
			<view class="distribution-head n-flex n-col-center u-p-20">
				<u-avatar :size="60" :src="userInfo.avatar || '/static/userAvatar.jpg'"></u-avatar>
				<view class="u-m-l-20">
					<view style="font-size: 40rpx;font-weight: bold;">
						{{userInfo.nickname}}
					</view>
					<view class="">
						邀请人数：{{ inviteTotal || 0 }}
					</view>
				</view>
			</view>
			<view class="distribution-balance n-flex n-row-between n-col-center">
				<view>
					余额
					<view class="balance">
						￥{{ userInfo.balance / 100 || 0 }}
					</view>
				</view>
				<u-button text="立即提现" style="width: 80px;color:#007aff;height: 60rpx;margin-right: 0;"
					@tap="go('pages/distribution/cash')"></u-button>
			</view>
			<u-cell-group>
				<u-cell :title="item.title" isLink :icon="item.icon" v-for="item in [
				{
					title:'推广海报',
					icon:'/static/rindex/haibao.png',
					id:0,
					url:'pages/share/index'
				},
				{
					title:'我的邀请',
					icon:'/static/rindex/tuandui.png',
					id:0,
					url:'pages/user/invitation'
				},
				{
					title:'提现记录',
					icon:'/static/rindex/tixian.png',
					id:0,
					url:'pages/distribution/cashlist'
				},
				{
					title:'收支明细',
					icon:'/static/rindex/shouyi.png',
					id:0,
					url:'pages/distribution/income'
				}
			]" :key="item.id" @tap="go(item.url)"></u-cell>
			</u-cell-group>
		</view>

		</view>

	</n-page>
</template>
<script>
	export default {
		data() {
			return {
				inviteTotal: 0,
			};
		},
		onLoad() {
			this.getInviterTotal();
		},
		methods: {
			async getInviterTotal() {
				const {
					data
				} = await uni.$u.http.post("/app/user/inviterLog/total");
				this.inviteTotal = data.data;
			},
		},
	};
</script>
<style lang="scss" scoped>
	.light .u-cell-group {
		background-color: #fff!important;
	}

	.distribution {
		height: 100%;
		overflow-y: auto;

		&-balance {
			height: 70px;
			background: linear-gradient(90deg, #007aff, #007aff);
			border-radius: 7px;
			padding: 15px;
			color: #fff;
			margin: 20rpx;

			.balance {
				font-size: 70rpx;
				font-weight: bolder;
			}

		}

		.u-cell-group {
			margin: 20rpx;
			border-radius: 20rpx;
			background-color: var(--bg);
		}
	}
</style>