<template>
	<view>
		<scroll-view scroll-x="true" class="scroll" scroll-with-animation="true">
			<view v-for="(item,index) in tab" :key="index" class="list-cont" @click="clickTabs(index,item.nav)">
				<view :class="{active: index== num}">
					<view>
						<text class="con-text-a">{{item.name}}</text>
					</view>
					<view>
						<text class="con-text-b" :class="{activeb: index== num}">{{item.title}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {homeList} from '../../../common/cloudfun.js'
	export default{
		name: "content",
		props:{
			tab:Array
		},
		data(){
			return{
				num: 0
			}
		},
		methods:{
			clickTabs(index,nav){
				this.num = index;
				//点击切换loading状态显示
				let loading = true
				//当tab切换的时候pageid置零
				let pageid = 0
				
				//对象的形式传值到vuex中
				let pullobj = {
					loading:loading,
					nav:nav,
					pageid:pageid
				}
				this.$store.commit('navmuta',pullobj)
				
				
				//请求数据库
				//上拉加载值
				let listid = 0
				homeList(nav,listid)
				.then((res)=>{
					//vuex传值
					let listdata = res.data
					this.$store.commit('listmuta',listdata)
					//点击切换loading状态显示
					let loading = false
					this.$store.commit('loadmuat',loading)
				})
				.catch((err)=>{
					console.log(err)
				})
			}
		},
		
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
