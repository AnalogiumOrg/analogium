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
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/Login.vue')
		},
		{
			path: '/admin',
			name: 'admin',
			component: () => import('@/views/Admin.vue')
		},
		{
			path: '/staff',
			name: 'staff',
			component: () => import('@/views/Staff.vue')
		},
		{
			path: '/staff/:slug',
			name: 'staff-member',
			component: () => import('@/views/StaffMember.vue')
		}
	]
})

export default router
