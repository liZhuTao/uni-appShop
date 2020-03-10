<template>
	<view style="margin: 0 20upx;">
		<view class="notice">
			<view v-for="(item,index) in noticeList" :key="index">
				<text class="notice-title">{{item.title}}</text>
				<text class="notice-describe">{{item.describe}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'classify',
		data(){
			return {
				noticeList:[
					{title:"标题1",describe:"描述1"},
					{title:"标题2",describe:"描述2"},
					{title:"标题3",describe:"描述3"},
					{title:"标题4",describe:"描述4"},
					{title:"标题5",describe:"描述5"},
					{title:"标题6",describe:"描述6"},
					{title:"标题7",describe:"描述7"},
					{title:"标题8",describe:"描述8"},
				]
			}
		}
	}
</script>

<style scoped>
	.notice{
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		-webkit-flex-wrap:wrap;
		overflow: hidden;
		border: 1rpx solid #eeeeee;
		border-radius: 10rpx;
	}
	.notice view{
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		padding: 20upx 0;
	}
	.notice view:nth-child(2) {
		border-left: 1rpx solid #eeeeee;
		border-right: 1rpx solid #eeeeee;
	}
	.notice view:nth-child(6) {
		border-left: 1rpx solid #eeeeee;
		border-right: 1rpx solid #eeeeee;
	}
	.notice view:nth-child(3) {
		border-right: 1rpx solid #eeeeee;
	}
	.notice view:nth-child(7) {
		border-right: 1rpx solid #eeeeee;
	}
	.notice view:nth-child(-n + 4) {
		border-bottom: 1rpx solid #eeeeee;
	}
	.notice-title{
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
	}
	.notice-describe{
		font-size: 23upx;
		color: #686868;
	}
</style>
