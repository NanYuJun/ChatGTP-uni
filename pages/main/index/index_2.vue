<template>
	<n-page >
		
		<view class="index n-flex-col n-col-center n-row-between">
			<image style="margin-top: 75rpx;width: 330rpx;height: 330rpx;"
				src="../../../static/index/index_2/机器人logo.png" />
			<image style="margin-top:50rpx;width: 410rpx;height: 170rpx;"
				src="../../../static/index/index_2/Welcome toChattyAI 👋.png" />
			<image style="width: 390rpx;height: 80rpx" src="../../../static/index/index_2/Your Description Here.png" />
			<image style="height: 115rpx;width: 670rpx" @tap="go('/pages/main/chat/index_2')"
				src="../../../static/index/index_2/Type=Button, Type 2=Primary, Type 3=Rounded, Style=Default, State=Active, Theme=Default, Component=Button.png" />
		</view>
	</n-page>
</template>
<style lang="scss">
	.index {
		flex: 1;
		transform: scale(.8);
	}
</style>