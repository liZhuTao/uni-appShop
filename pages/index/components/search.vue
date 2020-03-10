<template>
	<view>
		<!-- 搜索框 -->
		<view class="search">
			<view class="search-input">
				<img src="../../../static/tab/sousuo.svg" mode="widthFix">
				<input type="text" placeholder="请输入文字" disabled />
			</view>
		</view>
		<!-- 轮播组件 -->
		<swiper
		:indicator-dots="true"
		:autoplay="true"
		:interval="3000"
		:duration="1000"
		:circular="true"
		indicator-color="rgba(255,255,255)"
		indicator-active-color="#00ff00"
		>
			<swiper-item v-for="(item,index) in banner" :key="index">
				<view class="swiper-item" id="swiper-item">
					<img :src="item.img" class="img-url" mode="aspectFill">
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default{
		name:'search',
		data(){
			return{
				banner:[
					{"img":"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2076884751,2890821575&fm=26&gp=0.jpg"},
					{"img":"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2852928175,4143309050&fm=26&gp=0.jpg"},
					{"img":"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2850297137,916412018&fm=26&gp=0.jpg"},
					{"img":"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3005135712,2657691519&fm=26&gp=0.jpg"},
					{"img":"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=770826905,4167936486&fm=26&gp=0.jpg"}
				]
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
	swiper{
		height: 300upx;
	}
	.img-url{
		width: 100%;
		height: 300upx !important;
	}
</style>
