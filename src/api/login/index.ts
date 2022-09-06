// 各个code代表的含义
// 000000: 操作成功;  000001: 数据已存在;   000002: 密码不正确
// 000003: 手机号不正确;  000004: 其他异常;   000005: 登录过期
import { ElLoading } from 'element-plus';
import { IResultOr } from '../interface';
// import { getQueryCookie } from '../../utils/util';
// 引入数据库和对象仓库
import airbnb from '@/db';

const storeName = Object.keys(airbnb.userObjectStore)[0];

// mock接口: 用户注册
export async function userSignApi(params: any) {
    // 使用ElLoading组件模拟加载特效
    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
    })

    // 是否存在相同手机号
    const hasPhone = await new Promise((resolve, reject) => {
        airbnb.airbnbDB.getList(storeName).then((res: any) => {
            // 定时关闭
            setTimeout(() => { loading.close() }, 200);
            // eslint-disable-next-line array-callback-return
            res && res.filter((item: any) => {
                // 存在相同手机号
                if (item.phone === params.phone) {
                    resolve(true);
                }
            })
            resolve(false);
        })
    });
    let result: IResultOr;
    if (hasPhone) { // 此手机已注册过，存在数据库中
        result = await new Promise((resolve, reject) => {
            resolve({ code: '000001', success: false, message: '数据已存在', result: null })
        })
    } else { // 此手机未注册过，进行注册
        const obj = { status: 0 }
        Object.assign(params, obj)
        result = await new Promise((resolve, reject) => {
            airbnb.airbnbDB.updateItem(storeName, params).then((res: any) => {
                setTimeout(() => { loading.close() }, 200)
                resolve({ code: '000000', success: true, message: '操作成功', result: null })
            })
        })
    }
    return result;
}

// mock接口: 用户登录
export async function userLoginApi(params: any) {
    // 使用ElLoading组件模拟加载特效
    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
    })

    // 校验手机号和密码是否正确
    const correct: any = await new Promise((resolve, reject) => {
        airbnb.airbnbDB.getList(storeName).then((res: any) => {
            // 定时关闭
            setTimeout(() => { loading.close() }, 200);
            // eslint-disable-next-line array-callback-return
            res && res.filter((item: any) => {
                // 校验手机号
                if (item.phone === params.phone) {
                    // 校验密码
                    if (item.password === params.password) {
                        resolve({ code: '000000', userId: item.userId })
                    } else {
                        resolve({ code: '000002' })
                    }
                }
            })
            // 其他异常
            resolve({ code: '000004' })
        })
    })
    let result: IResultOr;
    if (correct.code !== '000000') { // 未校验成功，即手机号或密码不正确，亦或是其他异常
        result = await new Promise((resolve, reject) => {
            resolve({
                code: correct.code,
                success: false,
                message: correct.code === '000002' ? '密码不正确' : (correct.code === '000003' ? '手机号不正确' : '不存在该用户，请先注册'),
                result: null
            })
        })
    } else { // 校验成功，即手机号和密码都正确，就更新登录状态
        const token = (new Date()).getTime() + ''
        localStorage.setItem('token', token)
        const obj = { status: 1, userId: correct.userId, token }
        Object.assign(params, obj)
        result = await new Promise((resolve, reject) => {
            airbnb.airbnbDB.updateItem(storeName, params).then((res: any) => {
                setTimeout(() => { loading.close(); }, 200);
                resolve({
                    code: '000000',
                    success: true,
                    message: '操作成功',
                    result: obj
                })
            })
        })
    }

    return result;
}

// mock接口: 用户退出登录
export async function userLogoutApi() {
    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
    })
    // 根据用户token，找到对应用户信息
    const correct: any = await new Promise((resolve, reject) => {
        airbnb.airbnbDB.getList(storeName).then((res: any) => {
            setTimeout(() => { loading.close() }, 200)
            const token = localStorage.getItem('token')
            console.log('token', token)
            // eslint-disable-next-line array-callback-return
            res && res.filter((item: any) => {
                console.log('每一项', item)
                if (item.token && item.token.indexOf(token) !== -1) {
                    // 存在相同token，则找到了用户信息，返回此用户的userId
                    resolve({ userId: item.userId })
                }
            })
            // token不相同，则返回用户登录过期的状态
            resolve({ code: '000005' })
        })
    })
    let result: IResultOr
    if (correct.code === '000005') { // 用户登录已过期
        result = await new Promise((resolve, reject) => {
            resolve({ code: '000005', success: false, message: '登录过期', result: null })
        })
    } else { // 根据userId，找到对应的用户，然后修改其登录态为0且token为null
        const params: any = await new Promise((resolve, reject) => {
            airbnb.airbnbDB.getItem(storeName, correct.userId).then(res => {
                resolve(res)
            })
        })
        const obj = { status: 0, token: null }
        Object.assign(params, obj)
        result = await new Promise((resolve, reject) => {
            airbnb.airbnbDB.updateItem(storeName, params).then(res => {
                setTimeout(() => { loading.close() }, 200)
                resolve({ code: '000000', success: true, message: '操作成功', result: null })
            })
        })
    }
    return result
}
