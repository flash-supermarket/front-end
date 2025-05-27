import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/login', component: loginRegister },
  { path: '/', component: home },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
