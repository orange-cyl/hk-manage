<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// 在页面关闭的时候清除token
// import conf from '@/http/config.js';
// window.onbeforeunload=function(e){
// 	conf.clearCookie('Token');
// }
export default{
  name: 'App'
}
</script>
