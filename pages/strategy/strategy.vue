<template>
	<view>
		<Address :address="address"></Address>
		<Locality></Locality>
		<Content></Content>
		<!-- 发表 -->
		<view class="publish animated fadeInUp">
			<image src="../../static/tab/fab.png" mode="widthFix"></image>
		</view>
	</view>
	
</template>

<script>
	import Address from './components/address'
	import Locality from './components/locality'
	import Content from './components/content'
	import {addressdata} from '../../common/list.js'
	// 引入SDK核心类
	var QQMapWX = require('../../common/qqmap-wx-jssdk.js');
	var qqmapsdk;
	export default {
		name:'strategy',
		components:{
			Address,
			Locality,
			Content
		},
		data() {
			return {
				address:''
			}
		},
		methods:{
			addRess(){
				addressdata()
				.then((res)=>{
					console.log(res)
					this.address = res.result.address_reference.landmark_l2.title
					console.log(this.address)
				})
				.catch((err)=>{
					console.log("用户拒绝定位")
					this.address = '新校区'
				})
			}
		},
		created() {
			//定位
			this.addRess()
		}
	}
</script>

<style scoped>
	.publish{
		position: fixed;
		bottom: 20upx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
	}
	.publish image{
		width: 120upx !important;
		height: 100upx !important;
		border-radius: 40upx;
	}
</style>
