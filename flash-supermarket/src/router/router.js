import { createWebHistory, createRouter } from 'vue-router'
import { getIsLogin } from '@/http/cookie'
import home from '../components/home.vue'
import loginRegister from '../components/loginRegister.vue'
import personPage from '../components/personPage.vue'
import repoPage from '../components/repoPage.vue'
//对于需要登录的页面，使用 meta 属性标记
const routes = [
  { path: '/login', component: loginRegister },
  { path: '/', component: home },
  { path: '/personPage/:username', component: personPage, meta: { requiresAuth: true } },
  { path: '/repoPage', component: repoPage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

function isAuthenticated() {
  return getIsLogin();
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated()) {
    // 如果目标路由需要登录且用户未登录，则重定向到登录页
    // next('/login');
    next();//debug使用
  } else {
    // 否则正常放行
    next();
  }
});

export default router
