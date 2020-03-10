<template>
	<view>
		<Search></Search>
		<Ticket></Ticket>
		<Classify></Classify>
		<Content></Content>
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
				
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	
</style>
