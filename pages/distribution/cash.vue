<template>

	<n-page background="#fff">
		<view class="cash">
			<view style="">支付宝账号</view>
			<u-input v-model="params.account" style="border-bottom: 1px solid #f5f5f5;padding-left: 0;" type="text"
				placeholder="请输入支付宝账号" :border="false"></u-input>


			<view style="margin-top:40upx;">真实姓名</view>
			<u-input v-model="params.name" style="border-bottom: 1px solid #f5f5f5;padding-left: 0;" type="text"
				placeholder="请输入真实姓名" :border="false"></u-input>


			<view style="margin-top:40upx">提现金额</view>
			<u-input v-model="params.money" style="border-bottom: 1px solid #f5f5f5;padding-left: 0;" type="text"
				placeholder="请输入提现金额" :border="false"></u-input>

			<view style="color: #666666;font-size: 22upx;" class="u-m-t-20">
				可提现金额
				{{userInfo.balance / 100}} 元
			</view>
			<u-button type="primary" shape="circle" class="u-m-t-20" @tap="add">立即提现</u-button>
			<view style="color: #666666;font-size: 24upx;margin-top:20upx;margin-bottom:80upx">请填写真实有效的信息,否则提现失败
			</view>

		</view>



		</view>
	</n-page>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					money: '',
					account: '',
					name: ''
				}

			}
		},

		methods: {
			async add() {
				if (!/^\d+$/.test(this.params.money)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确金额，不能包含中文，英文，特殊字符和小数'
					});
					return;
				}
				const {
					data
				} = await uni.$u.http.post('/app/user/cash/add', this.params)
				if (data.code === 1000) {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					this.go('pages/distribution/cashlist');
				} else {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
				}
			},
			AllCash() {
				this.wxphone = this.money;
			},


		}
	}
</script>

<style lang='less'>
	.cash {
		height: 100%;
		padding: 20rpx;
	}
</style>