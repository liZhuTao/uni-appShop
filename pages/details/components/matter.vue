<template>
	<view>
		<!-- 图片视频介绍 -->
		<view class="cont-introduce cont-back">
			<view class="img-video">图片视频介绍</view>
			<view>
				<video objectFit="fill" v-if="videoing" :src="staticvideo" controls poster="http://img0.imgtn.bdimg.com/it/u=1014696770,1600211236&fm=26&gp=0.jpg"></video>
				<view>
					<block v-for="(items, index) in detaildata.topimg" :key="index">
						<image :src="items" mode="widthFix"></image>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'matter',
	props: {
		detaildata: Object
	},
	data() {
		return {
			videoing: false,
			staticvideo: ''
		};
	},
	watch: {
		detaildata(newvalue, oldvalue) {
			if (newvalue.videos != '') {
				console.log(newvalue.videos);
				this.staticvideo = newvalue.videos;
				this.videoing = true;
			} else {
				this.videoing = false;
				// console.log('没有视频')
			}
		}
	}
};
</script>

<style scoped>
/* 图文视频 */
.cont-back {
	padding: 20upx;
	background: #ffffff;
}
.cont-introduce {
	margin-top: 20upx;
}
.img-video {
	color: #333333;
	font-size: 30upx;
	font-weight: bold;
	padding: 20upx 0;
}
.cont-introduce video,
image {
	width: 100%;
}
.cont-introduce video {
	margin-bottom: 20upx;
}
</style>
