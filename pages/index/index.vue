<template>
	<view>
		<Search></Search>
		<Ticket></Ticket>
		<Classify></Classify>
	</view>
</template>

<script>
	import Search from './components/search'
	import Ticket from './components/ticket'
	import Classify from './components/classify'
	export default {
		components:{
			Search,
			Ticket,
			Classify
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
