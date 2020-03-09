<template>
	<view>
		<!-- 搜索框 -->
		<view class="search">
			<view class="search-input">
				<img src="../../../static/tab/sousuo.svg" mode="widthFix">
				<input type="text" placeholder="请输入文字" disabled />
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'search',
		data(){
			return{
				
			}
		},
	}
</script>

<style scoped>
	.search{
		background-color: #fff;
		padding: 30upx 0;
		background: linear-gradient(to top,#ffe566 10%,#ffd300);
	}
	.search-input{
		height: 70upx;
		line-height: 70upx;
		width: 650upx;
		margin: 0 50upx;
		display: flex;
		border-radius: 50upx;
		flex-direction: row;
		background-color: #fff7d4;
	}
	.search-input img{
		width: 40upx;
		height: 40upx;
		margin: auto 0 auto 20upx;
	}
	.search-input input{
		width: 100%;
		height: 70upx;
		line-height: 70upx;
		font-size: 30upx;
		color: #666666;
	}
</style>
