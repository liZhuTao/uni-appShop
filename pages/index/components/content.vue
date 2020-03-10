<template>
	<view>
		<scroll-view scroll-x="true" class="scroll" scroll-with-animation="true">
			<view v-for="(item,index) in tab" :key="index" class="list-cont" @click="clickTabs(index)">
				<view :class="{active: index== num}">
					<view>
						<text class="con-text-a">{{item.titel}}</text>
					</view>
					<view>
						<text class="con-text-b" :class="{activeb: index== num}">{{item.label}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		name: "content",
		data(){
			return{
				tab:[
					{titel:"推荐",label:"猜你喜欢"},
					{titel:"推荐1",label:"猜你喜欢1"},
					{titel:"推荐2",label:"猜你喜欢2"},
					{titel:"推荐3",label:"猜你喜欢3"},
					{titel:"推荐4",label:"猜你喜欢4"},
					{titel:"推荐5",label:"猜你喜欢5"}
				],
				num: 0
			}
		},
		methods:{
			clickTabs(index){
				this.num = index;
			}
		}
	}
</script>

<style scoped>
	.scroll{
		white-space: nowrap;
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20px 0;
	}
	.con-text-a {
		color: #292c33;
		font-size: 30upx;
		font-weight: bold;
	}
	.con-text-b {
		color: #9ea0a5;
		font-size: 23upx;
	}
	.list-cont {
		width: 180upx;
		display: inline-block;
		text-align: center;
	}
	.active{
		background: linear-gradient(to right,#ccffff 0%,#ffcc00 100%);
		border-top-right-radius: 50upx;
	}
	.activeb{
		color: #292C33 !important;
	}
</style>
