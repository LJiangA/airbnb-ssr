import { createApp, asyncDataFilter } from './main'
// 引入数据库和对象仓库
import airbnb from './db'

const { app, router, store } = createApp()

if ((window as any).__INITIAL_STATE__) {
    store.replaceState((window as any).__INITIAL_STATE__)
}

router.beforeEach((to, from, next) => {
    airbnb.airbnbDB.openStore({
        ...airbnb.langObjectStore,
        ...airbnb.userObjectStore,
        ...airbnb.orderObjectStore,
        ...airbnb.recordObjectStore
    }).then((res: any) => {
        console.log('初始化所有对象仓库', res);
        localStorage.getItem('userId') && store.commit('setUserStatus', 1)
        next();
    })
})

// app获得之后需要挂载，注意挂载的时机
// 最好的时机是 router准备完成之后
// router.isReady() 方法返回一个Promise
router.isReady().then(() => {
    router.beforeResolve((to, from, next) => {
        // 获取到to 和 from 的路由组件
        const toComponents = router.resolve(to).matched.flatMap(
            record => Object.values(record.components)
        )
        const fromComponents = router.resolve(from).matched.flatMap(
            record => Object.values(record.components)
        )
        // 比较路由组件的差异
        const diffComponents = toComponents.filter((c, i) => {
            return fromComponents[i] !== c
        })
        // 判断是否有差异,即没有进行路由跳转只是刷新页面时,差异组件的长度为0,此时就不用发请求预取数据
        if (!diffComponents.length) {
            return next()
        }
        // else {
        //     // 2. 先路由跳转,然后再异步请求获取数据
        //     next()
        // }
        console.log('开始loading----');
        // 对所有匹配的路由组件调用 asyncData() 函数
        // eslint-disable-next-line array-callback-return
        asyncDataFilter(diffComponents, store, router.currentRoute).then(() => {
            console.log('结束loading----');
            // 1. 先异步获取数据,然后再路由跳转
            next()
        })
    })

    // 挂载到app上
    app.mount('#app');
})

router.afterEach((to, from, next) => {
    const { meta } = to
    const { title, keywords, description } = meta
    const { roomDetail } = store.state
    const { title: roomTitle = '', owner } = roomDetail || {}
    const { introduce = '' } = owner || {}
    // 在客户端设置 meta 等信息
    if (title) {
        document.title = `${title}${roomTitle}`
    } else {
        document.title = ''
    }
    const keywordsMeta = document.querySelector('meta[name="keywords"]')
    // 问号? 相当于先判空再执行后面的语句
    keywordsMeta && keywordsMeta.setAttribute('content', `${keywords}${introduce}`)
    const descriptionMeta = document.querySelector('meta[name="keywords"]')
    descriptionMeta?.setAttribute('content', `${description}${introduce}`)
})