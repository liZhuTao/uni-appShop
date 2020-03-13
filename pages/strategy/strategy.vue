<template>
	<view>
		<Address></Address>
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
	export default {
		name:'strategy',
		components:{
			Address,
			Locality,
			Content
		},
		data() {
			return {
				
			}
		},
		methods: {
			
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
