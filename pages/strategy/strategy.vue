<template>
	<view>
		<Address :address="address"></Address>
		<Locality></Locality>
		<Content :localdata="localdata" v-if="!loadinglist"></Content>
		<!-- 发表 -->
		<view class="publish animated fadeInUp">
			<image src="../../static/tab/fab.png" mode="widthFix" @click="travels()"></image>
		</view>
		<!-- tab切换的loading -->
		<load-list v-if="loadinglist"></load-list>
		<!-- 没有数据的提示 -->
		<none-data v-if="nonedata"></none-data>
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
	//定义操作数据库
	var db = wx.cloud.database()
	var listdata = db.collection('userdata')
	
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
				addressData:'',
				localdata:[],		//列表数据
				loadinglist:false,
				nonedata:false
			}
		},
		methods:{
			//被子组件调用
			fatherMethod(name){
				console.log(name)
				//点击tabloading显示,没有数据的提示消失
				this.nonedata = false
				this.loadinglist = true
				if(name=="全部"){
					let city = this.address
					this.cityData(city)
				}else{
					console.log('不是全部')
					//分类筛选
					let city = this.address
					this.tabCity(city,name)
				}
			},
			
			
			addRess(){
				addressdata()
				.then((res)=>{
					console.log(res)
					this.address = res.result.address_reference.landmark_l2.title
					console.log(this.address)
					//定位成功查询数据库，取出对应地区的数据
					this.cityData(this.address)
				})
				.catch((err)=>{
					console.log("用户拒绝定位")
					this.address = '湖南工程学院'
					this.cityData(this.address)
				})
			},
			//定位成功查询数据库，取出对应地区的数据
			cityData(city){
				listdata.where({
					datainfo:{
						address:city
					}
				})
				.get()
				.then((res)=>{
					console.log(res)
					let citydata = res.data
					//筛选_id,datainfo里的数据合并成数组返回
					this.resultCity(citydata)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			//tab切换筛选的数据
			tabCity(city,name){
				listdata.where({
					datainfo:{
						address:city,
						classdata:name
					}
				})
				.get()
				.then((res)=>{
					console.log(res)
					let citydata = res.data
					this.resultCity(citydata)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			
			//筛选_id,datainfo里的数据合并成数组返回
			resultCity(citydata){
				var addData = citydata.map((item)=>{
					let id = item._id
					let datainfo = item.datainfo
					return {id,datainfo}
				})
				console.log(addData.length)
				this.localdata = addData
				//数据显示loading加载隐藏
				this.loadinglist = false
				//没有数据给予的提示
				if(addData.length === 0){
					this.nonedata = true
				}else{
					this.nonedata = false;
				}
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
			...mapState(['city','roturn']),
			count(){
				this.addressData = this.city.citying
			},
			// 如果监听到值为true，那么表示用户发表游记成功，然后再次刷新当前页面
			routing(){
				if(this.roturn.pagesid == true){
					console.log('再次刷新当前页面')
					this.addRess()
				}
			}
		},
		
		//侦听器
		watch:{
			addressData(newValue,oldValue){
				console.log(newValue)
				this.address = newValue
				this.cityData(newValue)
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
