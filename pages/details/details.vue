<template>
	<view>
		<view class="scroll-flex" v-show="!showsc" :style="{opacity:stylecity}">
			<Navs></Navs>
		</view>
		<Banner 
		:detaildata="detaildata"
		:leaveword = "leaveword"
		></Banner>
		<!-- 图片视频详情组件 -->
		<view class="matter-page">
			<Matter :detaildata="detaildata"></Matter>
		</view>
		<!-- 留言组件 -->
		<view class="message-page">
			<Message 
			:messageword="messageword"
			:leaveword = "leaveword"
			:detaid = "detaid"
			></Message>
		</view>
		<!-- 留言为空的提示 -->
		<view style="margin-bottom: 90upx;" v-if="nonedata">
			<none-data></none-data>
		</view>
		<!-- 进入页面的loading加载 -->
		<home-load v-if="homeload"></home-load>
	</view>
</template>

<script>
	import Navs from './components/navs.vue'
	import Banner from './components/banner.vue'
	import Matter from './components/matter.vue'
	import Message from './components/message.vue'
	// 定义操作数据库
	var db = wx.cloud.database()
	var listdata = db.collection('userdata')
	// var messdatabase = db.collection('message')
	export default{
		name:'datails',
		components:{
			Navs,Banner,Matter,Message
		},
		data(){
			return {
				showsc: true,
				stylecity:0,
				detaid:'',
				detaildata:{},
				messageword:[],
				leaveword:[],
				nonedata:false,
				homeload:true
			}
		},
		//监听页面滚动
		onPageScroll(e) {
		    // console.log(e)
			let top = e.scrollTop
			this.handScroll(top)
		},
		methods:{
			//监听页面滚动
			handScroll(top){
				if(top>90){
					// console.log('距离顶部90px')
					let opacity = top / 170
					opacity = opacity > 1 ? 1 : opacity
					// console.log(opacity)
					this.stylecity = opacity
					this.showsc = false
				}else{
					this.showsc = true
				}
			},
			//请求查询数据库有没有这个id
			detailrep(id){
				listdata.where({
					_id:id
				})
				.get()
				.then((res)=>{
					console.log(res)
					// 赋值取到的详情页数据
					this.detaildata = res.data[0].datainfo
					this.homeload = false
					
				})
				.catch((err)=>{
					console.log(err)
				})
			},
		},
		onLoad(e) {
			console.log(e)
			this.detaid = '2f7b7efa5e70f1980001e73d3fd03f84'  //e.id
			//请求查询数据库有没有这个id,取到图片视频
			this.detailrep(this.detaid)
		}
	}
</script>

<style scoped>
	page{
			background: #f8f8f8;
		}
	.scroll-flex{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: #ffd00c;
		z-index: 2;
	}
</style>
