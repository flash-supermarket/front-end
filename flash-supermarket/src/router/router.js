import { createWebHistory, createRouter } from 'vue-router'


import loginRegister from '../components/loginRegister.vue'

const routes = [
  { path: '/login', component: loginRegister },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
