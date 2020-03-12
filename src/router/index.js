import Vue from 'vue'
import VueRouter from 'vue-router' 


const login = () =>import('views/login')
const home = () =>import('views/home')
const user = () =>import('components/user/user')



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
      {path:'/user',component:user}
    ]
    
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
