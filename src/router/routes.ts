import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/home' },

    { path: '/home', name: 'Home', component: () => import('@/views/Home.vue') },
    { path: '/demo', name: 'Demo', component: () => import('@/views/Demo.vue') },
    { path: '/game', name: 'Game', component: () => import('@/views/Game.vue') },
    { path: '/prime', name: 'Prime', component: () => import('@/views/Prime.vue') },
]