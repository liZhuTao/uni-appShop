<template>
	<view>
			<view class="locality">
				<view class="title">社区精品海淘</view>
			</view>	
			<!-- tab -->
			<view class="menu-block">
				<block v-for="(item,index) in citytab" :key="index">
					<view :class="{activetext:index == num}" @click="menubtn(index)">{{item.name}}</view>
				</block>
					
			</view>
			
		</view>
</template>

<script>
	export default{
		name:'local',
		data() {
			return {
				num:0,
				citytab:[
					{
						"name":'全部'
					},
					{
						"name":'书籍资料'
					},
					{
						"name":'食品'
					},
					{
						"name":'生活'
					},
					{
						"name":'手机'
					},
					{
						"name":'电子'
					},
					{
						"name":'彩妆'
					}
				]
			}
		},
		
		methods:{
			menubtn(index){
				this.num = index
			}
		}
		
	}
</script>

<style scoped>
.locality{
	margin: 0 20upx;
}
.title{
	color: #292c33; 
	font-size: 50upx;
}
.activetext{
	color: #4CD964; 
	background: #ffdd00 !important; 
	border: 1px solid #ffdd00 !important;
}
.menu-block {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
}
.menu-block view {
	background: #ffffff;
	border: 1px solid #c2c5cc;
	border-radius: 6upx;
	font-size: 25upx;
	color: #292c33;
	font-weight: bold;
	text-align: center;
	padding: 15upx;
	margin: 20upx;
}

</style>