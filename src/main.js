import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入element-ui插件并安装
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
//引入axios
import MyHttpServer from 'plugins/http'
Vue.use(MyHttpServer)
//导入moment时间过滤器
import moment from 'moment'

Vue.config.productionTip = false

//全局过滤器-处理日期
Vue.filter('fmtdata',(v)=>{
  return moment(v).format('YYYY-MM-DD')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
