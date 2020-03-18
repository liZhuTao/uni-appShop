<template>
	<view>
		<!-- banner -->
		<view class="banner-posi">
			<view>
				<swiper
					:indicator-dots="true"
					:interval="3000"
					:duration="1000"
					:circular="true"
					indicator-color="rgba(255, 255, 255)"
					indicator-active-color="#00ff00"
					@change="bannerfun"
				>
					<block v-for="(item, index) in imgArray" :key="index">
						<swiper-item>
							<view class="swiper-item"><image :src="item" mode="aspectFill" class="imageurl" @click="previmg(index)"></image></view>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 轮播数字 -->
			<view class="banner-num">
				<text>{{ bannerindex + num }}</text>
				<text>/{{ imgArray.length }}</text>
			</view>
		</view>

		<!-- 标题 -->
		<view class="cont-back">
			<view class="title-con">{{ detaildata.tipsdata }}</view>
			<!-- 销量之类 -->
			<view class="volume">
				<view class="purchase userinfo">
					<image :src="detaildata.avatarUrl" mode="widthFix"></image>
					<text class="active-purchase">{{detaildata.nickName}}</text>
				</view>
				<text>评论{{ leaveword.length }}条</text>
				<text>收藏</text>
			</view>
		</view>
	</view>
</template>

<script>
import { preview } from '../../../common/list.js';
export default {
	name: 'banners',
	props: {
		detaildata: Object,
		leaveword: Array
	},
	data() {
		return {
			imgArray: [],
			bannerindex: 0,
			num: 1,
		};
	},

	methods: {
		bannerfun(e) {
			console.log(e);
			this.bannerindex = e.detail.current;
		},

		// 预览图片
		previmg(index) {
			let imglist = this.imgArray;
			preview(index, imglist)
				.then(res => {
					console.log('预览成功in');
				})
				.catch(err => {
					console.log('预览失败');
				});
		}
	},

	// 取到数组的前三张图片
	watch: {
		detaildata(newvalue, oldvalue) {
			// console.log(newvalue.topimg.slice(0,3))
			this.imgArray = newvalue.topimg.slice(0, 3);
		}
	}
};
</script>

<style scoped>
/* 引入公用样式 */
@import url("../../../common/uni.css");
/* 轮播 */
.imageurl {
	width: 100%;
	height: 500upx !important;
}
swiper {
	height: 500upx !important;
}
.banner-num {
	background: #333333;
	width: 100upx;
	color: #ffffff;
	text-align: center;
	border-radius: 15upx;
	font-size: 25upx;
	height: 40upx;
	line-height: 40upx;
	position: absolute;
	right: 20upx;
	bottom: 20upx;
}
.banner-posi {
	position: relative;
	height: 500upx;
}

.userinfo image{width: 50upx; height: 50upx; border-radius: 50upx;}
.userinfo text{padding-left: 20upx;}
.userinfo{padding-top: 20upx;}
/* 标题 */
.cont-back {
	padding: 20upx;
	background: #ffffff;
}
.title-con {
	color: #333333;
	font-size: 35upx;
	font-weight: bold;
	line-height: 1.5;
	padding-bottom: 30upx;
}
/* 销量之类 */
.volume {
	font-size: 25upx;
	color: #999999;
	display: flex;
	justify-content: space-between;
}
.volume>text {
	display: block;
	margin-top: 33upx;
}
</style>
