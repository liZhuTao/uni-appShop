<template>
	<view class="loadmin">
		<view class="home-load">
			<image src="../static/tab/homeload.svg" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
</script>

<style scoped>
	.home-load{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.home-load image{
		width: 200upx;
		height: 200upx;
		background: rgba(0,0,0,0.2);
		border-radius: 10upx;
	}
	.loadmin{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		overflow: hidden;
		background: rgba(242,243,244,0.6);
	}
</style>
