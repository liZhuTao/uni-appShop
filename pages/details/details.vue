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
	var messdatabase = db.collection('message')
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
			messagedata(id){
				messdatabase.where({
					id:id
				})
				.orderBy('messagedata.time','desc')
				.get()
				.then(res=>{
					console.log(res)
					let resdata = res.data
					//取出ai分类的标签
					this.classdata(resdata)
					//取出留言列表
					this.publicMess(resdata)
				})
				.catch(err=>{
					console.log(err)
				})
			},
			//点击分类筛选数据
			queryMessage(id,item){
				messdatabase.where({
					id:id,
					classmessage:item
				})
				.orderBy('messagedata.time','desc')
				.get()
				.then(res=>{
					console.log(res)
					let resdata = res.data
					//取出留言列表
					this.publicMess(resdata)
				})
				.catch(err=>{
					console.log(err)
				})
			},
			//取出ai分类的标签
			classdata(resdata){
				var messageword = resdata.map(item=>{
					return item.classmessage
				})
				//数组去重,ES6 Set()
				let newarr = Array.from(new Set(messageword))
				//数组去空,filter过滤
				let newarr1 = newarr.filter(item=>item)
				
				console.log(messageword)
				this.messageword = newarr1
			},
			//取出留言列表
			publicMess(resdata){
				var leaveword = resdata.map(item=>{
					return item.messagedata
				})
				console.log(leaveword)
				if(leaveword.length === 0){
					this.nonedata = true
				}else{
					this.nonedata = false
					this.leaveword = leaveword
				}
				
			},
			//子组件执行父组件方法，请求留言数据
			fatherMethod(item){
				console.log(item)
				if(item == '全部'){
					this.messagedata(this.detaid)
				}else{
					//ai分类筛选
					this.queryMessage(this.detaid,item)
				}
			},
			//锚点链接跳转
			fatherTab(index){
				// console.log(index)
				if(index == 1){
					let details = ".matter-page"
					this.pageScroll(details)
				}else if(index == 2){
					let details = ".message-page"
					this.pageScroll(details)
				}
				
			},
			//锚点链接跳转
			pageScroll(details){
				const query = this.createSelectorQuery()
				query.select(details).boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res=>{
					console.log(res)
					uni.pageScrollTo({
						scrollTop:res[0].top+res[1].scrollTop-35,
						duration:300
					})
				})
			}
		},
		onLoad(e) {
			console.log(e)
			this.detaid = e.id
			//请求查询数据库有没有这个id,取到图片视频
			this.detailrep(this.detaid)
			//请求留言数据
			this.messagedata(this.detaid)
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
