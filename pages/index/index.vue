<template>
	<view>
		<Search :banner="banner"></Search>
		<Ticket></Ticket>
		<Classify></Classify>
		<Content id="boxFixed" :class="{is_fixed:isFixed}" :tab="tab"></Content>
		<view style="height: 140upx;"></view>
		<Article :list="list"></Article>
	</view>
</template>

<script>
	import Search from './components/search'
	import Ticket from './components/ticket'
	import Classify from './components/classify'
	import Content from './components/content'
	import Article from './components/article'
	import {home} from '../../common/cloudfun.js'
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
				banner:[],
				tab:[],
				list:[]
			}
		},
		//
		created() {
			//请求轮播数据
			let banner = 'banner'
			let tab = 'tab'
			let lising = 'recomment'
			//promise.all 可以批量请求多个接口，同时得到多个数据
			Promise.all([home(banner),home(tab),home(lising)])
			.then((res)=>{
				console.log(res)
				//轮播数据
				this.banner = res[0].data
				//tab数据
				this.tab = res[1].data
				//推荐数据，第一个tab里的数据
				this.list = res[2].data
			})
			.catch((err)=>{
				console.log(err)
			})
			//请求tab数据
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
