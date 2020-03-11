<template>
	<view>
		<Search :banner="banner"></Search>
		<Ticket></Ticket>
		<Classify></Classify>
		<Content id="boxFixed" :class="{is_fixed:isFixed}" :tab="tab"></Content>
		<view style="height: 140upx;"></view>
		<load-list v-if="loadinglist"></load-list>
		<Article :list="list" v-if="!loadinglist"></Article>
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
				list:[],
				loadinglist:false,     //loading 的切换状态
			}
		},
		//
		created() {
			//请求轮播数据
			let banner = 'banner'
			let tab = 'tab'
			let lising = 'recomment'
			//promise.all 可以批量请求多个接口，同时得到多个数据
			Promise.all([home(banner),home(tab),homeList(lising)])
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
			//取出vuex数据仓库的数据
			...mapState(['alist',navmin]),
			//取到tab切换的数据
			count(){
				this.list = this.alist.listing
			},
			countload(){
				this.loading = this.navmin.loading
			},
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
