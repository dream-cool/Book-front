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
axios.defaults.baseURL = 'http://127.0.0.1:8443'
axios.defaults.timeout = 5000

Vue.config.productionTip = false

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
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求错误(400)'; break
        case 401: error.message = '未授权，请重新登录(401)'; break
        case 403: error.message = '拒绝访问(403)'; break
        case 404: error.message = '请求出错(404)'; break
        case 408: error.message = '请求超时(408)'; break
        case 500: error.message = '服务器错误(500)'; break
        case 501: error.message = '服务未实现(501)'; break
        case 502: error.message = '网络错误(502)'; break
        case 503: error.message = '服务不可用(503)'; break
        case 504: error.message = '网络超时(504)'; break
        case 505: error.message = 'HTTP版本不受支持(505)'; break
        default: error.message = `连接出错(${error.response.status})!`
      }
    } else {
      error.message = '服务异常!'
    }
    window.ELEMENT.Message.error(error.message)
    NProgress.done()
    return Promise.reject(error)
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
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求错误(400)'; break
        case 401: error.message = '未授权，请重新登录(401)'; break
        case 403: error.message = '拒绝访问(403)'; break
        case 404: error.message = '请求出错(404)'; break
        case 408: error.message = '请求超时(408)'; break
        case 500: error.message = '服务器错误(500)'; break
        case 501: error.message = '服务未实现(501)'; break
        case 502: error.message = '网络错误(502)'; break
        case 503: error.message = '服务不可用(503)'; break
        case 504: error.message = '网络超时(504)'; break
        case 505: error.message = 'HTTP版本不受支持(505)'; break
        default: error.message = `连接出错(${error.response.status})!`
      }
    } else {
      error.message = '服务异常!'
    }
    window.ELEMENT.Message.error(error.message)
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
