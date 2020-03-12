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
	pageid:0,
	uniload:'',
	nonedata:''
}

//tab切换没有数据的提示
const nonemin = {
	nonedata:''
}


//数据仓库
const state = {
	alist,
	load,
	navmin,
	nonemin,
	
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
			// console.log(pullobj)
			state.navmin = {
				loading:pullobj.loading,
				naving:pullobj.nav,
				pageid:pullobj.pageid,
				uniload:pullobj.uniload,
				nonedata:pullobj.nonedata
			}
		},
		
		//tab切换没有数据的提示
		nonemuta(state,noneion){
			console.log(noneion)
			state.nonemin = {
				nonedata:noneion
			}
		}
	}
})