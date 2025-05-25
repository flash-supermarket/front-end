import { createWebHistory, createRouter } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import TheWelcome from '../components/TheWelcome.vue'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/welcome', component: TheWelcome },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
