<template>
	<view>
		<view class="travels">
			<!-- 分类 -->
			<view class="classify-view">
				<view class="classify-text">分类</view>
				<block v-for="(item, index) in fication" :key="index">
					<view class="classify">
						<text :class="{ activetext: index == num }" @click="menubtn(index, item.name)">{{ item.name }}</text>
					</view>
				</block>
			</view>
			<!-- 标题 -->
			<view class="travels-title"><input type="text" placeholder="给你的文章起个标题吧" class="place-text" v-model="titledata" /></view>
			<!-- 描述 -->
			<view class="travels-describe"><textarea placeholder="描述下你的商品或者心情,让更多的人了解" v-model="tipsdata" /></view>
		</view>

		<!-- 上传图片 -->
		<view class="travels-image">
			<view class="topimg"><image src="../../static/tab/topimg.png" mode="widthFix" @click="uploadImg()"></image></view>
			<!-- 九宫格 -->
			<view class="conteng">
				<block v-for="(item, index) in topimg" :key="index">
					<view class="conteng-img">
						<image :src="item" mode="aspectFill" class="uploadimg" @click="preImage(index)"></image>
						<image src="../../static/tab/deteimg.svg" mode="widthFix" class="deleteimg" @click="deleteImg(index)"></image>
					</view>
				</block>
			</view>
		</view>

		<!-- 上传视频 -->
		<view class="travels-video">
			<view class="topimg"><image src="../../static/tab/topvideo.png" mode="widthFix" @click="uploadVideo()"></image></view>
			<view class="uploadvideo" v-if="uploadvideos">
				<video :src="videos" controls objectFit="cover" poster="http://img0.imgtn.bdimg.com/it/u=1014696770,1600211236&fm=26&gp=0.jpg"></video>
				<image class="pause" src="../../static/tab/delvideo.png" @click="deleteVideo()"></image>
			</view>
		</view>

		<!-- 定位 -->
		<view class="address">
			<view class="address-text">发布到</view>
			<view class="address-site">
				<image src="../../static/tab/addimg.svg" mode="widthFix"></image>
				<text @click="chooseCity()">{{ address }}</text>
			</view>
		</view>

		<!-- 发布 -->
		<view class="release" @click="suBmitd()">发布</view>
		<!-- 及时反馈组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>

		<!-- 登录模态框 -->
		<motal ref="mon"></motal>
		<!-- 提示用户上传成功与否 -->
		<view class="warp" v-if="relend">
			<view class="warp-view tipmin">
				<text>{{ reldata }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import {preview,addressdata} from '../../common/list.js'
import {mapState} from 'vuex'
export default {
	name: 'travels',
	data() {
		return {
			num: 0,
			fication: [
					{
						"name":'全部'
					},
					{
						"name":'书籍资料'
					},
					{
						"name":'食品'
					},
					{
						"name":'生活'
					},
					{
						"name":'手机'
					},
					{
						"name":'电子'
					},
					{
						"name":'彩妆'
					},
					{
						"name":'男装'
					},
					{
						"name":'女装'
					},
					{
						"name":'心情'
					},
					{
						"name":'其他'
					},
			],

			uploadvideos: false,
			watchaddress: '',
			classdata: '景点', //分类
			titledata: '', //标题
			tipsdata: '', //描述
			topimg: [], //上传的图片
			videos: '', //上传的视频
			address: '', //选择的城市
			avatarUrl: '', // 用户头像
			nickName: '', // 用户昵称
			openid: '', // 用户openid
			// 提示用户正在发布
			reldata: '正在发布...请勿关闭该页面',
			relend: false
		};
	},
	methods:{
		//点击分类切换
		menubtn(index){
			this.num = index
		},
		//上传图片
		uploadImg(){
			uni.chooseImage({
			    count: 9, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album'], //从相册选择
			    success: (res)=> {
			        console.log(...res.tempFilePaths);
					this.topimg.push(...res.tempFilePaths)
					
			    }
			});
		},
		//删除图片
		deleteImg(index){
			this.topimg.splice(index,1)
		},
		//预览图片
		preImage(index){
			// 预览图片
			let imglist = this.topimg
			preview(index,imglist)
			.then((res)=>{
				console.log('预览成功')
			})
			.catch((err)=>{
				console.log('预览失败')
			})
		},
		//上传视频
		uploadVideo(){
			uni.showLoading({
			    title: '上传中'
			});
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				maxDuration:20,
			})
			.then((res)=>{
				console.log(res)
				this.videos = res[1].tempFilePath
				this.uploadvideos = true
				uni.hideLoading();
			})
			.catch((err)=>{
				console.log(err)
			})
		},
		//删除视频
		deleteVideo(){
			this.videos = ''
			this.uploadvideos = false
		},
		//定位
		addRess(){
			addressdata()
			.then((res)=>{
				console.log(res)
				let city = res.result.address_reference.landmark_l2.title
				this.address = city
			})
			.catch((err)=>{
				console.log("用户拒绝定位")
				this.address = '新校区'
			})
		},
		//跳转到选择城市页面
		chooseCity(){
			uni.navigateTo({
				url:'../city/city'
			})
		}
		
	},
	created() {
		//定位
		this.addRess()
	},
	//计算属性
	computed:{
		...mapState(['travecity']),
		count(){
			this.watchaddress = this.travecity.traveing
		}
	},
	//侦听器
	watch:{
		watchaddress(newValue,oldValue){
			console.log(newValue)
			this.address = newValue
		}
	}
};
</script>

<style scoped>
.travels {
	padding: 10upx 20upx;
}
.classify text {
	display: block;
	font-size: 27upx;
	color: #14181e;
	background: #f7f7f7;
	padding: 10upx 20upx;
	border-radius: 20upx;
	margin: 10upx 20upx;
}
.classify {
	display: flex;
}
.classify-text {
	font-size: 30upx;
	color: #14181e;
	font-weight: bold;
}
.classify-view {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
}
/* 选中的样式 */
.activetext {
	background: #ffdd00 !important;
}
/* 标题 */
.place-text {
	color: #808080 !important;
	font-size: 30upx;
}
.travels-title {
	margin: 40upx 0;
}
/* 描述 */
.travels-describe textarea {
	width: 100%;
	color: #808080 !important;
	font-size: 30upx;
}
/* 上传图片 */
.topimg image {
	width: 150upx;
	height: 150upx;
	border-radius: 20upx;
}
.topimg {
	padding-left: 20upx;
	padding-top: 10upx;
}
/* 九宫格 */
.conteng {
	display: flex;
	flex-wrap: wrap;
	margin-left: 4px;
	margin-right: 4px;
}
.conteng-img {
	width: calc((100% / 4) - 8px) !important;
	margin: 4px;
	height: 176upx;
	position: relative;
}
.uploadimg {
	width: 100% !important;
	height: 100% !important;
	border-radius: 10upx;
}
/* 删除图片 */
.deleteimg {
	width: 38upx;
	height: 38upx;
	position: absolute;
	top: 6upx;
	right: 6upx;
}
/* 视频 */
.uploadvideo video {
	width: 100%;
	height: 400upx;
	border-radius: 5upx;
}
.uploadvideo {
	margin: 0 8px;
	border-radius: 5upx;
	position: relative;
}
/* 覆盖视频 */
.pause {
	width: 50upx;
	height: 50upx;
	position: absolute;
	top: 6upx;
	right: 6upx;
}
/* 位置 */
.address-site {
	display: flex;
	align-items: center;
}
.address-site image {
	width: 40upx;
	height: 40upx;
	margin-right: 10upx;
}
.address-site text {
	font-size: 30upx;
	color: #00a2ff;
}
.address-text {
	font-size: 30upx;
	color: #333333;
	padding-right: 40upx;
}
.address {
	display: flex;
	background: #f1f1f1;
	padding: 20upx 0 20upx 20upx;
	margin-top: 30upx;
	margin-bottom: 160upx;
}
/* 发布 */
.release {
	background: #ffdd00;
	width: 100%;
	height: 100upx;
	font-size: 40upx;
	line-height: 100upx;
	text-align: center;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
}
/* 提示用户上传成功与否 */
.warp {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 9999;
}
.warp-view {
	width: 500upx;
	height: 200upx;
	background: #ffffff;
	margin: auto;
	position: absolute;
	-webkit-position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	border-radius: 8upx;
	overflow: hidden;
}
/* 提示框 */
.tipmin text {
	font-size: 34upx;
	display: flex;
	justify-content: center;
	line-height: 200upx;
}
</style>
