import { createSSRApp } from 'vue';
import App from './App.vue';
// 按需导入element-plus的组件
import ElementPlus, { ElMessage } from 'element-plus';
// 导入element-plus样式
import 'element-plus/dist/index.css';
import { createSSRRouter } from './router';
// 引入实例 i18n
import { createSSRI18n } from './language/i18n';
import { key, createSSRStore } from './store';
import { sync } from 'vuex-router-sync';

export function createApp() {
    const app = createSSRApp(App)
    const router = createSSRRouter()
    const store = createSSRStore()
    const i18n = createSSRI18n()
    sync(store, router)

    // 全局使用
    app.use(router)
    app.use(ElementPlus)
    app.config.globalProperties.$message = ElMessage
    app.use(i18n)
    app.use(store, key)

    return { app, router, store }
}

export function asyncDataFilter(matchedComponents: any, store: any, route: any) {
    // eslint-disable-next-line array-callback-return
    return Promise.all(matchedComponents.map((Component: any) => {
        if (Component.asyncData) {
            return Component.asyncData({
                store,
                route
            })
        }
    }))
}