<template>
	<view>
		<Search :banner="banner"></Search>
		<Ticket></Ticket>
		<Classify></Classify>
		<Content id="boxFixed" :class="{is_fixed:isFixed}"></Content>
		<view style="height: 140upx;"></view>
		<Article></Article>
	</view>
</template>

<script>
	import Search from './components/search'
	import Ticket from './components/ticket'
	import Classify from './components/classify'
	import Content from './components/content'
	import Article from './components/article'
	export default {
		components:{
			Search,
			Ticket,
			Classify,
			Content,
			Article
		},
		data() {
			return {
				isFixed: false,
				rect:'',
				menutop:'',
				banner:[]
			}
		},
		//
		created() {
			//请求轮播数据
			const db = wx.cloud.database()        //指定要操作的数据库
			const banner = db.collection('banner')   //指定请求的数据集合
			banner.get()
			.then((res)=>{
				console.log(res)
				this.banner = res.data
			})
			.catch((err)=>{
				console.log(err)
			})
		},
		//监听页面滚动
		onPageScroll(e){
			this.rect = e.scrollTop
		},
		onLoad() {
			const query = wx.createSelectorQuery()
			query.select("#boxFixed").boundingClientRect()
			query.exec((res)=>{
				// console.log(res)
				this.menutop = res[0].top
			})
		},
		//计算属性:时刻监听数据变化，数据发生变化，计算属性重新执行
		computed:{
			//滑动组件置顶
			namepage(){
				if(this.rect>this.menutop){
					this.isFixed = true
				}else{
					this.isFixed = false
				}
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.is_fixed{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
	}
</style>
