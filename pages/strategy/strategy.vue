<template>
	<view>
		<Address :address="address"></Address>
		<Locality></Locality>
		<Content></Content>
		<!-- 发表 -->
		<view class="publish animated fadeInUp">
			<image src="../../static/tab/fab.png" mode="widthFix" @click="travels()"></image>
		</view>
	</view>
	
</template>

<script>
	import Address from './components/address'
	import Locality from './components/locality'
	import Content from './components/content'
	import {addressdata} from '../../common/list.js'
	//取到vuex里面的值
	import {mapState} from 'vuex'
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
				address:'',
				addressData:''
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
			},
			//跳转到发表页面
			travels(){
				uni.navigateTo({
					url:'../travels/travels'
				})
			}
		},
		created() {
			//定位
			this.addRess()
		},
		//计算属性
		computed:{
			...mapState(['city']),
			count(){
				this.addressData = this.city.citying
			}
		},
		
		//侦听器
		watch:{
			addressData(newValue,oldValue){
				console.log(newValue)
				this.address = newValue
			}
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
