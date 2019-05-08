const pageSize = 20
// 设置cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}
// 获取cookie
function getCookie(cname) {
  const str = document.cookie
  if (str.indexOf('; ')) {
    const arr = str.split('; ')
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i].split('=')
      if (item[0] === cname) {
        return cname + ' ' + item[1]
      }
    }
  } else {
    // let name = cname + '='
    const ca = document.cookie.replace(/=/, ' ')
    return ca
  }
  return ''
}
// 清除cookie
function clearCookie(name) {
  setCookie(name, '', -1)
}
export default {
  pageSize: pageSize,
  setCookie: setCookie,
  getCookie: getCookie,
  clearCookie: clearCookie
}
