import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/origin',
			name: 'origin',
			component: () => import('@/views/Origin.vue')
		},
		{
			path: '/data',
			name: 'data',
			component: () => import('@/views/Articles.vue')
		}
	]
})

export default router
