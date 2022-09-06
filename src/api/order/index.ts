/**
 * code: '000000'表示'操作成功'；code: '000001'表示'数据已存在'；code: '000002'表示'密码不正确'；
 * code: '000003'表示'手机号不正确'；code: '000004'表示'其他异常'；code: '000005'表示'登录过期'；
 */
import { ElLoading } from 'element-plus'
import { IResultOr } from '../interface'
import airbnb from '@/db' // 引入数据库和对象仓库

const storeName = Object.keys(airbnb.orderObjectStore)[0]

// Mock接口：立即预定
export async function saveOrderApi(params: any) {
    // 拿到 userId
    const userId = Number(localStorage.getItem('userId'))

    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
    })

    // 是否存在相同订单Id
    const hasOrderId = await new Promise((resolve, reject) => {
        airbnb.airbnbDB.getList(storeName).then((res: any) => {
            setTimeout(() => {
                loading.close()
            }, 200)
            // eslint-disable-next-line array-callback-return
            res && res.filter((item: any) => {
                if (item.orderId === params.orderId && item.userId === userId) { // 存在相同订单Id
                    resolve(true)
                }
            })
            resolve(false)
        })
    })
    let result: IResultOr
    if (hasOrderId) {
        result = await new Promise((resolve, reject) => {
            resolve({ code: '000001', success: false, message: '数据已存在', result: null })
        })
    } else {
        // 合并 params 和 userId 参数，以便每个用户只能查询到自己的订单数据
        Object.assign(params, { userId })
        result = await new Promise((resolve, reject) => {
            airbnb.airbnbDB.updateItem(storeName, params).then(res => {
                setTimeout(() => {
                    loading.close()
                }, 200)
                resolve({ code: '000000', success: true, message: '操作成功', result: null })
            })
        })
    }
    return result
}

// Mock接口：订单列表
export async function fetchOrderApi() {
    // 拿到 userId
    const userId = Number(localStorage.getItem('userId'))

    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
    })
    const result: IResultOr = await new Promise((resolve, reject) => {
        airbnb.airbnbDB.getList(storeName).then((res: any) => {
            setTimeout(() => {
                loading.close()
            }, 200)
            // 根据 userId 过滤当前用户下的订单数据
            res = res.filter((item: any) => {
                return item.userId === userId
            })
            setTimeout(() => { // 有意延迟200毫秒，感受异步组件的效果
                resolve({ code: '000000', success: true, message: '操作成功', result: res || null })
            }, 200)
        })
    })
    return result
}
