import axios from 'axios'
const MyHttpServer = {}

MyHttpServer.install = (Vue)=>{
    axios.defaults.baseURL='http://47.105.168.115:8888/api/private/v1/'
    Vue.prototype.$http= axios
  }
  export default  MyHttpServer