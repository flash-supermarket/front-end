import { createMemoryHistory, createRouter } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import TheWelcome from '../components/TheWelcome.vue'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/welcome', component: TheWelcome },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
