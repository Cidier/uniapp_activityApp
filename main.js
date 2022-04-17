import App from './App'

// #ifndef VUE3
import Vue from 'vue'

//引入全局组件
import divider from "./components/common/divider.vue"   // 分割线组件
Vue.component("divider", divider)
import noThing from "./components/common/noThing.vue"   // noThing 组件
Vue.component("noThing", noThing)

// 引入全局配置文件（API 接口前缀）
import $C from "./common/config.js"
Vue.prototype.$C = $C

// 引入工具函数库
import $U from "./common/util.js"
Vue.prototype.$U = $U

// 引入请求库
import $H from "./common/request.js"
Vue.prototype.$H = $H
// 引入Vuex 仓库
import store from "./store/index.js"
Vue.prototype.$store = store

// 权限验证
Vue.prototype.chackAuth = (callback, checkPhone=true) => {
	if (!store.state.loginStatus) {
		uni.showToast({
			title: '请先登录',
			icon:"none"
		})
		return uni.navigateTo({
			url: '/pages/login/login',
		})
	}
	// 验证是否绑定手机号
	if(checkPhone && !store.state.user.phone){
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		return uni.navigateTo({
			url: '/pages/user-phone/user-phone'
		})
	}
	callback()
}

// 权限验证跳转
Vue.prototype.navigateTo = (options, checkPhone=true) => {
	if (!store.state.loginStatus) {
		uni.showToast({
			title: '请先登录',
			icon:"none"
		})
		return uni.navigateTo({
			url: '/pages/login/login',
		})
	}
	// 验证是否绑定手机号
		if(checkPhone && !store.state.user.phone){
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			return uni.navigateTo({
				url: '/pages/user-phone/user-phone'
			})
		}
	uni.navigateTo(options)
}

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
			store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif