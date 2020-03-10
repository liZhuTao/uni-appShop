<template>
	<view>
		<!-- 分类导航 -->
		<view class="sort">
			<view class="sort-item" v-for="(item,index) in sortList" :key="index">
				<img :src="item.image">
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'ticket',
		data(){
			return {
				sortList:[
					{image:require("../../../static/tab/man.png"),name:"男生"},
					{image:require("../../../static/tab/weman.png"),name:"女生"},
					{image:require("../../../static/tab/book.png"),name:"书籍"},
					{image:require("../../../static/tab/life.png"),name:"生活"},
					{image:require("../../../static/tab/phone.png"),name:"电子"}
				]
			}
			
		}
	}
</script>

<style scoped>
	.sort{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		margin: 30upx 30upx;
	}
	.sort-item{}
	.sort-item img{
		width: 90upx;
		height: 90upx;
	}
	.sort text{
		font-size: 30upx;
		display: block;
		margin-left: 15upx;
	}
</style>
