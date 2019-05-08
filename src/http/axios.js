// import axios from 'axios'
// import conf from './config'
// // import qs from 'qs'
// const token = conf.getCookie('Token')
// axios.defaults.baseURL = 'http://192.168.50.50:10000'
// // axios.defaults.baseURL = 'http://192.168.50.95:10000'
// axios.defaults.headers.post['Content-Type'] = 'application/JSON'
// // axios.interceptors.request.use((config) => {
// //   if (config.method === 'post') {
// //     // config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
// //   }
// //   return config
// // })
// // axios.interceptors.response.use((response) => {
// //   return response
// // })

// // 设置cookie
// // function setCookie(cname, cvalue, exdays) {
// //   var d = new Date()
// //   d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
// //   var expires = 'expires=' + d.toUTCString()
// //   document.cookie = cname + '=' + cvalue + '; ' + expires
// // }
// // 获取cookie
// // function getCookie(cname) {
// //   const str = document.cookie
// //   if (str.indexOf('; ')) {
// //     const arr = str.split('; ')
// //     for (let i = 0; i < arr.length; i++) {
// //       const item = arr[i].split('=')
// //       if (item[0] === cname) {
// //         return cname + ' ' + item[1]
// //       }
// //     }
// //   } else {
// //     // const name = cname + '='
// //     const ca = document.cookie.replace(/=/, ' ')
// //     return ca
// //   }
// //   return ''
// // }
// // 清除cookie
// // function clearCookie(name) {
// //   setCookie(name, '', -1)
// // }

// // 配置前后端数据交互的请求头：
// // axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// // 将token放到请求头部，在登录那边已经处理
// axios.defaults.headers.common['Authorization'] = conf.getCookie('Token')

// export default axios
