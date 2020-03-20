<template>
	<view>
		<view class="address">
			<view class="address-img">
				<image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3628832208,3170804138&fm=26&gp=0.jpg" mode="aspectFill"></image>
			</view>
			<view class="address-list">
				<view class="address-text" @click="chooseCity()">
					<text class="words">{{address}}</text>
					<image src="../../../static/tab/jiantouxia.png" mode="widthFix"></image>
				</view>
				<text class="words-eng">welcome</text>
			</view>
			<!-- 搜索框 -->
			<view class="search">
				<view class="search-input" @click="searchPage()">
					<img src="../../../static/tab/sousuo.svg" mode="widthFix">
					<input type="text" placeholder="请输入文字" disabled />
				</view>
			</view>
			<!-- 阴影 -->
			<view class="back"></view>
		</view>
		
	</view>
</template>

<script>
	export default{
		name:'add',
		props:{
			address:String
		},
		methods:{
			//选择城市
			chooseCity(){
				uni.navigateTo({
					url:'../city/city'
				})
			},
			searchPage(){
				uni.navigateTo({
					url:'../search/search'
				})
			}
		},
		
		
	}
</script>

<style scoped>
.address-text {
	display: flex;
	align-items: center;
}
.address-text image {
	width: 33upx;
	height: 33upx;
	padding-left: 30upx;
}
.address {
	position: relative;
	height: 400upx;
}
.address-list {
	position: absolute;
	left: 50upx;
	top: 100upx;
	z-index: 999;
}
.address-img {
	width: 100%;
	height: 400upx;
}
.address-img image {
	width: 750rpx !important;
	height: 400upx;
}
.words {
	font-size: 50upx;
	color: #ffffff;
	font-weight: bold;
}
.words-eng {
	font-size: 30upx;
	color: #ffffff;
}
.back {
	background: rgba(0, 51, 0, 0.3);
	position: absolute;
	top: 0;
	left: 0;
	height: 400upx;
	width: 100%;
}
/* 搜索 */
	.search{
		position: absolute;
		left: 0upx;
		right: 0;
		bottom: 15upx;
		padding: 30upx 0;
		z-index: 999;
	}
	.search-input{
		height: 70upx;
		line-height: 70upx;
		width: 650upx;
		margin: 0 50upx;
		display: flex;
		border-radius: 50upx;
		flex-direction: row;
		background-color: #FFFFFF;
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
