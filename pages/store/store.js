import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)





//首页tab切换传输的值
const alist={
	listing:[]
}
//tab切换状态
const navmin = {
	loading:''
}

const state = {
	alist,
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
		naumuat(state,loading){
			state.navmin = {
				loading:loading
			}
		}
	}
})