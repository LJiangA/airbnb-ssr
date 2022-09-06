import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router';
// 路由懒加载
const home = () => import('@/views/home/index.vue')
const mine = () => import('@/views/mine/index.vue')
const login = () => import('@/views/login/index.vue')
const roomDetail = () => import('@/views/detail/index.vue')
const record = () => import('@/views/record/index.vue')

const routes = [
    {
        path: '/home',
        name: 'home',
        component: home,
        meta: {
            title: '爱此迎-全球大型房屋租赁平台',
            keywords: '爱此迎，特价房源，品质房源，租赁平台',
            description: '爱此迎(AirCnb)是房屋租赁平台。爱此迎(AirCnb)的房屋涉及上海、北京、杭州、苏州等60个城市，覆盖了特价房源、品质房源，帮助用户实现从线上房屋预定和浏览功能。 ',
            keepAlive: false
        }
    },
    {
        path: '/mine',
        name: 'mine',
        component: mine,
        meta: {
            title: '',
            keywords: '',
            description: '',
            keepAlive: false
        }
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            title: '',
            keywords: '',
            description: '',
            keepAlive: false
        }
    },
    {
        path: '/roomDetail/:id',
        name: 'roomDetail',
        component: roomDetail,
        meta: {
            title: '爱此迎-',
            keywords: '',
            description: '',
            keepAlive: false
        }
    },
    {
        path: '/record',
        name: 'record',
        component: record,
        meta: {
            title: '',
            keywords: '',
            description: '',
            keepAlive: false
        }
    },
    // 重定向
    {
        path: '',
        redirect: '/home'
    }
];

export function createSSRRouter() {
    return createRouter({
        // 服务端渲染使用 createMemoryHistory
        // 客户端渲染使用 createWebHistory
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        // 这个参数相当于vue2中的 是否有hash值，也就是选择路由模式
        // 相当于Vue2的 mode: 'history'
        routes,
    });
}