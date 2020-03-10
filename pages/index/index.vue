<template>
	<view>
		<Search></Search>
		<Ticket></Ticket>
		<Classify></Classify>
		<Content id="boxFixed" :class="{is_fixed:isFixed}"></Content>
		<view style="height: 3000upx;"></view>
	</view>
</template>

<script>
	import Search from './components/search'
	import Ticket from './components/ticket'
	import Classify from './components/classify'
	import Content from './components/content'
	export default {
		components:{
			Search,
			Ticket,
			Classify,
			Content
		},
		data() {
			return {
				isFixed: false,
				rect:'',
				menutop:''
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
