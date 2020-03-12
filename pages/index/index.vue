<template>
	<view>
		<Search :banner="banner"></Search>
		<Ticket></Ticket>
		<Classify></Classify>
		<Content id="boxFixed" :class="{is_fixed:isFixed}" :tab="tab"></Content>
		<view style="height: 140upx;"></view>
		<load-list v-if="loadinglist"></load-list>
		<Article :list="list" v-if="!loadinglist"></Article>
		<!-- 没有数据的提示 -->
		<none-data v-if="nonedata"></none-data>
		<!-- 上拉加载组件 -->
		<view class="load-more" v-if="loadmore">
			<uni-load-more :status="uniload" color="#ffcc99"></uni-load-more>
		</view>
		
	</view>
</template>

<script>
	import Search from './components/search'
	import Ticket from './components/ticket'
	import Classify from './components/classify'
	import Content from './components/content'
	import Article from './components/article'
	import {home,homeList} from '../../common/cloudfun.js'
	import {mapState} from 'vuex'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"		//导入上拉加载组件
	
	export default {
		components:{
			Search,
			Ticket,
			Classify,
			Content,
			Article,
			uniLoadMore
		},
		data() {
			return {
				isFixed: false,
				rect:'',
				menutop:'',
				banner:[],
				tab:[],
				list:[],
				loadinglist:false,      //loading 的切换状态
				pageid:0,               //上啦加载值
				nav:'',                 //tab切换拿到的集合
				uniload:'loading',      //上拉加载状态
				loadmore:false,         //隐藏上拉加载
				nonedata:false,         //tab切换没有数据的提示
			}
		},
		//
		created() {
			//请求轮播数据
			let banner = 'banner'
			let tab = 'tab'
			let listing = 'recomment'
			//promise.all 可以批量请求多个接口，同时得到多个数据
			Promise.all([home(banner),home(tab),homeList(listing,this.pageid)])
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
		//
		methods:{
			//上啦加载
			pullon(){
				let listing = this.nav
				homeList(listing,this.pageid)
				.then((res)=>{
					console.log(res)
					//如果没数据
					if(res.data.length == 0){
						this.uniload = 'noMore'
					}else{
						//合并数据
						this.list = [...this.list,...res.data]
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			}
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
		// 上拉加载
		onReachBottom(){
			// 上拉加载显示上拉加载组件
			this.loadmore = true
			this.uniload = 'loading'
			console.log('触底')
			this.pageid++
			console.log(this.pageid)
			this.pullon()
		},
		//计算属性:时刻监听数据变化，数据发生变化，计算属性重新执行
		computed:{
			//取出vuex数据仓库的数据
			...mapState(['alist','load','navmin','nonemin']),
			//取到tab切换的数据
			count(){
				this.list = this.alist.listing
			},
			countload(){
				this.loadinglist = this.load.loading
			},
			//以对象传值
			navdata(){
				this.loadinglist = this.navmin.loading
				this.nav = this.navmin.naving
				this.pageid = this.navmin.pageid
				this.loadmore = this.navmin.uniload
				this.nonedata = this.navmin.nonedata
			},
			//滑动组件置顶
			namepage(){
				if(this.rect>this.menutop){
					this.isFixed = true
				}else{
					this.isFixed = false
				}
			},
			//tab切换没有数据的情况
			noneted(){
				this.nonedata = this.nonemin.nonedata
			}
		},
	}
</script>

<style scoped>
	.is_fixed{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
	}
	.load-more{
		height: 160upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
