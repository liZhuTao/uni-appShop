import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)





//首页tab切换传输的值
const alist={
	listing:[]
}
//tab切换状态
const load = {
	loading:''
}

const navmin={
	loading:'',
	naving:'recomment',
	pageid:0
}

const state = {
	alist,
	load,
	navmin
}




export default new Vuex.Store({
	state,
	//同步操作
	mutations:{
		listmuta(state,listdata){
			state.alist = {
				listing:listdata
			}
		},
		//tab切换的loading状态
		loadmuat(state,loading){
			state.load = {
				loading:loading
			}
		},
		//以对象传过来的参数
		navmuta(state,pullobj){
			console.log(pullobj)
			state.navmin = {
				loading:pullobj.loading,
				naving:pullobj.nav,
				pageid:pullobj.pageid
			}
		}
	}
})