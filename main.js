import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//引入vuex
import store from './pages/store/store.js'
Vue.prototype.$store = store

//引用tab切换的loading
import loader from './element/loading.vue'
Vue.component('load-list',loader)

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
