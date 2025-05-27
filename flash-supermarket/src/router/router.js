import { createWebHistory, createRouter } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import TheWelcome from '../components/TheWelcome.vue'

const routes = [
  { path: '/login', component: loginRegister },
  { path: '/', component: home },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
