import { ElLoading } from 'element-plus';
import { IResultOr } from '../interface';
import airbnb from '@/db' // 引入数据库和对象仓库

const storeName = Object.keys(airbnb.langObjectStore)[0]

// mock接口: 保存当前语言包
export async function saveLanguageApi(lang: any) {
    // 使用ElLoading组件模拟加载特效
    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
    })

    // 打开数据库
    // await airbnb.airbnbDB.openStore(storeName);
    // 先检查 id=1 的用户是否在数据库中
    const resultOr: IResultOr = await airbnb.airbnbDB.getItem(storeName, 1).then(res => {
        return {
            code: '000000',
            message: '操作成功',
            result: res || null,
            success: true
        }
    })

    // 如果数据在则更新,如果不在则插入
    const { success } = resultOr
    let obj = {}
    if (success) {
        // 数据存在,直接更新
        obj = { name: lang, id: 1 }
    } else {
        // 数据不在,则插入
        obj = { name: lang }
    }

    // 更新(新增/修改)数据库中的数据
    const result: IResultOr = await airbnb.airbnbDB.updateItem(storeName, obj).then((res: any) => {
        setTimeout(() => {
            loading.close()
        }, 200);
        return {
            code: '000000',
            success: true,
            message: '操作成功',
            result: null
        }
    })
    return result;
}

// Mock接口: 获取当前语言包
export async function fetchLanguageApi() {
    // 这里也可以选择添加loading加载效果
    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
    })
    // 打开数据库
    // await airbnb.airbnbDB.openStore(storeName);
    // 更新(新增/修改)数据库中的数据
    const result: IResultOr = await airbnb.airbnbDB.getItem(storeName, 1).then((res: any) => {
        setTimeout(() => { loading.close() }, 200);
        return {
            code: '000000',
            success: true,
            message: '操作成功',
            result: res || null
        }
    })
    // 返回结果
    return result;
}