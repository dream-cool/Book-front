// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/icon/iconfont.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.inc(0.5)
NProgress.configure({ easing: 'ease', speed: 800, showSpinner: false })

// axios.defaults.baseURL = 'http://39.97.239.108:8090'
axios.defaults.baseURL = 'http://39.97.239.108:8090'
axios.defaults.timeout = 5000

Vue.use(axios)

Vue.config.productionTip = false
Vue.prototype.$http = axios

axios.interceptors.request.use(

  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With, Authorization'
    }
    var token = localStorage.getItem('token')
    NProgress.start()
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    NProgress.done()
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code == 401) {
      router.push({
        path: '/login',
        querry: {redirect: router.currentRoute.fullPath}// 从哪个页面跳转
      })
    }
    NProgress.done()
    return response
  },
  error => {
    NProgress.done()
    return Promise.reject(error)
  }
)

router.beforeEach((to, from, next) => {
  NProgress.start()
  var token = localStorage.getItem('token')// 获取本地存储的token
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (token != null && token !== '') { // 通过vuex state获取当前的token是否存
      if (to.meta.permissions) {
        var userDetail = JSON.parse(localStorage.getItem('userDetail'))
        if (userDetail.permission != null && userDetail.permission[to.meta.permissions]) {
          next()
        } else {
          next({
            path: '/noAuthority',
            query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
        }
      } else {
        next()
      }
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

router.afterEach(route => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
