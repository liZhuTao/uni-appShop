<template>
	<view>
		<view class="navs">
			<block v-for="(item, index) in navalue" :key="index">
				<text :class="{ navactivetext: index == num }" @click="navbtn(index)">{{item.name}}</text>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		name:'navs',
		data() {
			return {
				num:0,
				navalue:[
					{
						'name':'宝贝'
					},
					{
						'name':'详情'
					},
					{
						'name':'评价'
					}
				]
			}
		},
		methods:{
			navbtn(index){
				this.num = index
				if(index === 0){
					this.backTop()
				}else{
					this.$parent.fatherTab(index)
				}
				// vuex传值到banner页面
				// if(index != 0){
				// 	this.$store.dispatch('navdata', index)
				// }
			},
			// 宝贝
			backTop(){
				if(uni.pageScrollTo){
					// console.log(wx.pageScrollTo)
					uni.pageScrollTo({
						scrollTop:0
					})
				}
			},
			
		}
	}
</script>

<style scoped>
	@import "../../../common/public.css";
</style>