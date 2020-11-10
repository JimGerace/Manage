import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Login from '../components/Login.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Home from '../components/Home.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
// import Welcome from '../components/Welcome.vue'

const User = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/User.vue')
// import User from '../components/User.vue'
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/Rights.vue')
// import Rights from '../components/Rights.vue'
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/Roles.vue')
// import Roles from '../components/Roles.vue'

const Cate = () => import(/* webpackChunkName: "cate_params_list" */ '../components/Cate.vue')
// import Cate from '../components/Cate.vue'
const Params = () => import(/* webpackChunkName: "cate_params_list" */ '../components/Params.vue')
// import Params from '../components/Params.vue'
const List = () => import(/* webpackChunkName: "cate_params_list" */ '../components/List.vue')
// import List from '../components/List.vue'

const AddGoods = () => import(/* webpackChunkName: "addgoods_order_report" */ '../components/AddGoods.vue')
// import AddGoods from '../components/AddGoods.vue'
const Order = () => import(/* webpackChunkName: "addgoods_order_report" */ '../components/Order.vue')
// import Order from '../components/Order.vue'
const Report = () => import(/* webpackChunkName: "addgoods_order_report" */ '../components/Report.vue')
// import Report from '../components/Report.vue'

Vue.use(VueRouter)

  const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {
      path: '/home', component: Home,
      children: [
        {path: '/', redirect: '/welcome'},
        {path: '/welcome', component: Welcome},
        {path: '/users', component: User},
        {path: '/rights', component: Rights},
        {path: '/roles', component: Roles},
        {path: '/categories', component: Cate},
        {path: '/params', component: Params},
        {path: '/goods', component: List},
        {path: '/goods/add', component: AddGoods},
        {path: '/orders', component: Order},
        {path: '/reports', component: Report}
      ]
    }
]

const router = new VueRouter({
  routes
})

//路由导航守卫
router.beforeEach((to, from, next)=> {
  if(to.path === '/login'){
    return next();
  }
  var tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr){
    return next('/login');
  }
  next();
})

export default router
