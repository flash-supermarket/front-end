import { createWebHistory, createRouter } from 'vue-router'
import home from '../components/home.vue';
import loginRegister from '../components/loginRegister.vue';

const routes = [
  { path: '/login', component: loginRegister },
  { path: '/', component: home },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
