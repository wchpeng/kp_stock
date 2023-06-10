import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SelfView from '../views/SelfView.vue'
import StocklistView from '../views/StocklistView.vue'
import StockdetailView from '../views/StockdetailView.vue'
import LoginView from '../views/LoginView.vue'
import store from '@/store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/stocklist',
    children: [
      {
        path: '/self',
        name: 'self',
        component: SelfView
      },
      {
        path: '/stocklist',
        name: 'stocklist',
        component: StocklistView
      },
      {
        path: '/stock-detail/:tsCode([0-9A-Za-z\.]+)',
        name: 'stock-detail',
        component: StockdetailView
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {unnecessaryAuth: true},
    component: LoginView
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next) => {
  console.log(to.meta)
  if(!to.meta.unnecessaryAuth){//判断该路由是否需要登录权限
      if(store.state.token){//通过vuex的state获取当前的token是否存在
          next()
      }else{
          console.log('store.token: ', store.state.token)
          // next()
          next({
              // path:"/login",
              name: 'login',
              query:{redirect:to.fullPath}//将跳转的路由path作为参数，登陆成功后跳转到该路由
          })
      }
  }else{
      next();
  }    
})

export default router
