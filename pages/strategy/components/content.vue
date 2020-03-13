<template>
	<view class="active">
			<view class="conteng">
				<block v-for="(item,index) in Articleend" :key="index">
				<view class="conteng-article newing" @click="localCont(item.id)">
					<view  class="conteng-img">
						
							<image :src="item.image" mode="aspectFill"></image>	
						
					</view>
					<!-- 文字介绍 -->
					<view class="active-introduce">
						<view class="active-name">{{item.title}}</view>
						<view class="active-title">{{item.list}}</view>
					</view>	
						<view class="purchase userinfo">
							<image :src="item.nameimg" mode="widthFix"></image>
							<text class="active-purchase">{{item.name}}</text>
						</view>
				</view>
				</block>
			</view>
		</view> 
</template>

<script>
	export default{
		data(){
			return {
				Articleend:[
					{
						"image":"cloud://myshop-3iu7o.6d79-myshop-3iu7o-1301521414/list/a (28).jpg",
						"title":"金色项链",
						"list":"项链全新，原价60，现价45不讲价",
						"nameimg":"cloud://myshop-3iu7o.6d79-myshop-3iu7o-1301521414/list/a (28).jpg",
						"name":"网友一"
					},
					{
						"image":"cloud://myshop-3iu7o.6d79-myshop-3iu7o-1301521414/list/a (28).jpg",
						"title":"金色项链",
						"list":"项链全新，原价60，现价45不讲价",
						"nameimg":"cloud://myshop-3iu7o.6d79-myshop-3iu7o-1301521414/list/a (28).jpg",
						"name":"网友一"
					},
					{
						"image":"cloud://myshop-3iu7o.6d79-myshop-3iu7o-1301521414/list/a (28).jpg",
						"title":"金色项链",
						"list":"项链全新，原价60，现价45不讲价",
						"nameimg":"cloud://myshop-3iu7o.6d79-myshop-3iu7o-1301521414/list/a (28).jpg",
						"name":"网友一"
					}
				]
			}
		}
	}
</script>

<style scoped>
	/* 引入公用样式 */
	@import url("../../../common/uni.css");
	.userinfo image{width: 50upx; height: 50upx; border-radius: 50upx;}
	.userinfo text{padding-left: 20upx;}
	.userinfo{padding-top: 20upx;}
	.newing{padding-bottom: 30upx;}
</style>
