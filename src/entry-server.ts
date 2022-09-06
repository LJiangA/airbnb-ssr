import { createApp, asyncDataFilter } from './main'
import { renderToString } from 'vue/server-renderer'

export async function render(url: string, manifest: any) {
    const { app, router, store } = createApp()
    // 因为 entry-server.ts 是运行在服务端，所以我们需要将每次发起页面请求的时候，需要将url
    // 传递给vue应用，并且在客户端和服务端中复用相同的路由配置，这是同步渲染的关键。
    await router.push(url)
    // 不管是在客户端还是服务端，都需要先等待解析完异步路由组件，才能合理调用组件中的一些构造函数。
    await router.isReady()

    // Vue3 获取匹配的组件
    const matchedComponents = router.currentRoute.value.matched.flatMap(
        record => Object.values(record.components)
    )
    // console.log('匹配组件:', matchedComponents);

    // 对所有匹配的路由组件调用 asyncData() 函数
    await asyncDataFilter(matchedComponents, store, router.currentRoute)

    // 1. 渲染的上下文对象, 使用renderToString方法时传入该参数,就能拿到整个应用中所自动注册的使用过的组件的模块id
    const context: any = {}
    // 使用 renderToString 将vue实例渲染成一个html字符串
    const appHtml = await renderToString(app, context);
    // 从 store 仓库中拿到 state 状态, 并返回
    const state = store.state;

    // 只需要在生产环境返回预加载指令
    if (import.meta.env.PROD) {
        // 2. 通过上下文对象context.modules 可以获取到清单文件中的id, 它返回一个new Set的类数组集合
        const preloadLinks = renderLinks(context.modules, manifest)
        return { appHtml, state, preloadLinks }
    } else {
        return { appHtml, state }
    }
}

// 3. 通过遍历manifest和modules类数组集合,可以找到当前视图中所存在的静态资源文件
// 4. 最后将获取到的这些静态资源进行字符串拼接, 并赋值给preloadLinks
function renderLinks(modules: any, manifest: any) {
    let links = ''
    modules.forEach((id: any) => {
        const files = manifest[id]
        if (files) {
            files.forEach((file: any) => {
                links += renderPreloadLink(file)
            })
        }
    })
    return links
}

// 根据文件名的后缀,将其转换为不同html结构的字符串
function renderPreloadLink(file: any) {
    // console.log('------file', file)
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}" >`
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}" >`
    } else if (file.endsWith('.woff')) {
        return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin >`
    } else if (file.endsWith('.woff2')) {
        return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin >`
    } else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
    } else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`
    } else {
        // TODO
        return ''
    }
}