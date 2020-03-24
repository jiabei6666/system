import Vue from 'vue'
import VueRouter from 'vue-router' 


const login = () =>import('views/login')
const home = () =>import('views/home')
const user = () =>import('components/user/user')
const jurisdiction = () =>import('components/jurisdiction/jurisdiction')
const role = () =>import('components/role/role')
const goods = () =>import('components/goods/goods')
const goodsadd = () =>import('components/goodsadd/goodsadd')
const params = () =>import('components/params/params')
const categories = () =>import('components/categories/categories')
import { Message } from 'element-ui';


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'login'
    
  },
  {
    path:'/login',
    component:login
  },
  {
    path:'/home',
    name:'home',
    component:home,
    children:[
      {path:'/users',component:user},
      {path:'/rights',component:jurisdiction},
      {path:'/roles',component:role},
      {path:'/goods',component:goods},
      {path:'/goodsadd',component:goodsadd},
      {path:'/params',component:params},
      {path:'/categories',component:categories}
    ]
    
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



router.beforeEach((to, from, next) => {
    if(to.path === '/login') {
      next()
    }else{
      const token = localStorage.getItem('token')
      if(!token) {
          router.push('/login')
          Message.warning('请登录')
      }
      next()
    }
})

export default router
