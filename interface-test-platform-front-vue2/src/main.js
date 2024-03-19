import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入element-ui，需要先npm install element-ui安装，此处为全量引入，可使用按需引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//导入自定义的样式
import '@/assets/css/icon.css'

Vue.config.productionTip = false

//添加ElementUI
Vue.use(ElementUI, { size: 'small' })

// 格式化百分比显示
Vue.filter('percent', function (data) {
  var result = Math.round(data * 10000);
  return result / 100 + "%"
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
