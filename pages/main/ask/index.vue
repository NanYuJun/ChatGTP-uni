<template>
	<view class="container">
		<view class="bg"></view>
		<view class="form">
			<view class="panel">
				<view class="head">
					<view class="title">关于本代码</view>
				</view>
				<view class="content">
					<p>前端开源地址：<a
							href="https://ext.dcloud.net.cn/plugin?id=10884">https://ext.dcloud.net.cn/plugin?id=10884（运行可直接使用）</a>
					</p>
					<p>功能建议反馈：<a href="https://support.qq.com/product/503589">https://support.qq.com/product/503589</a>
					</p>
					<p>后端代码：赞助88元获取持续更新版本<a href="https://work.weixin.qq.com/kfid/kfcd219a953abd6ae70">(联系作者)</a></p>
				</view>
				<view class="bottom">
					南羽工作室回复
				</view>
			</view>
			<view class="panel">
				<view class="head">
					<view class="title">关于作者</view>
				</view>
				<view class="content">
					<p>微信：M-Nanyu</p>
					<p>微信公众号：南羽工作室</p>

				</view>

			</view>
			<view class="panel">
				<view class="head">
					<view class="title">未来计划</view>
				</view>
				<view class="content">
					<p>优化GPT模型</p>
					<p>增加关键词问答</p>
				</view>
				<view class="bottom">
					南羽工作室回复
				</view>
			</view>
			<view class="panel">
				<view class="head">
					<view class="title">更新记录</view>
				</view>
				<view class="content">
					<h3>1.0.1</h3>
					<p>1.新增自定义KEY功能</p>
					<p>2.修复若干问题</p>
					<br>
					<h3>1.0.2</h3>
					<p>增加了上下文关联</p>
					<br>
					<h3>1.0.3</h3>
					<p>1.增加服务端，解决官方key暴露的问题</p>
					<p>2.新增对话模式页面</p>
				</view>
				<view class="bottom">
					南羽工作室回复
				</view>
			</view>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			onSubmit() {
				uni.navigateTo({
					url: '/pages/main/answer/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		width: 90%;
		margin: 0 auto;
		z-index: 999;

		.header {
			margin-bottom: 30rpx;

			.title {
				text-align: center;
				color: #fff;
				margin: 30rpx 0rpx;
			}
		}

		.panel {
			padding: 30rpx;
			background-color: #fff;
			border-radius: 15rpx;
			box-shadow: 0rpx 10rpx 10rpx #eee;
			margin-bottom: 15rpx;

			.bottom {
				font-size: 24rpx;
			}

			.head {
				border-bottom: 1rpx solid #eee;
				padding-bottom: 30rpx;

				.title {
					font-weight: bolder;
					font-size: 30rpx;
				}
			}

			.content {
				margin: 30rpx 0rpx;
			}

			.bottom {
				background-color: #F0FAF8;
				color: #26B3A0;
				padding: 15rpx;
				border-radius: 10rpx;
			}
		}
	}

	.bg {
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		width: 100%;
		background-color: #26B3A0;
		min-height: 200rpx;
		border-radius: 0rpx 0rpx 140rpx 140rpx;
		z-index: -1;
	}
</style>
