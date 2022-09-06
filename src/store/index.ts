import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { saveLanguageApi } from '@/api/layout/index';
import { InjectionKey } from 'vue';
import { fetchRoomList } from '@/api/home/index'
import { fetchRoomDetail } from '@/api/detail/index'
import { IRoomListParams, IRoomDetailParams } from '@/api/interface'

// 为 store state 声明类型
export interface AllStateTypes {
    locale: any,
    userStatus: number,
    roomList: Array<any>,
    pageNo: number,
    pageSize: number,
    total: number,
    cityCode: string,
    roomDetail: any,
    roomId: null,
    orderVisible: boolean,
}
// 定义 Injection key
export const key: InjectionKey<Store<AllStateTypes>> = Symbol('storeKey');

// 封装一下useStore方法
export function useStore() {
    return baseUseStore(key);
}

export function createSSRStore() {
    return createStore<AllStateTypes>({
        state: {
            locale: null, // 语言包
            userStatus: 0, // 登录状态
            roomList: [], // 房屋列表数据
            pageNo: 1,
            pageSize: 6,
            total: 0,
            cityCode: 'hz',
            roomDetail: {}, // 房屋详情数据
            roomId: null, // 房屋Id
            orderVisible: false, // 房屋订单显示|隐藏
        },
        mutations: {
            // 设置语言包
            setLang(state: any, lang: any) {
                state.locale = lang
                return state.locale
            },
            // 设置登录状态
            setUserStatus(state: any, status: any) {
                state.userStatus = status
                return state.userStatus
            },
            // 设置房屋列表数据
            setRoomList(state: any, value: any) {
                state.roomList = value;
                return state.roomList
            },
            // 设置房屋详情数据
            setRoomDetail(state: any, value: any) {
                state.roomDetail = value;
                return state.roomDetail
            },
            // 设置房屋Id
            setRoomId(state: any, value: any) {
                state.roomId = value
                return state.roomId
            },
            // 设置订单中心
            setOrderVisible(state: any, value: any) {
                state.orderVisible = value
                return state.orderVisible
            }
        },
        actions: {
            // mock接口保存当前语言包
            saveLang({ commit }: any, lang: any) {
                saveLanguageApi(lang.name).then(res => {
                    const { success } = res;
                    if (success) {
                        commit('setLang', lang)
                        console.log('保存当前语言包成功');
                    }
                })
            },
            // 真实接口请求,获取房屋列表数据
            getRoomList({ commit, state }, payload: IRoomListParams) {
                const { pageNo, cityCode = state.cityCode } = payload;
                state.pageNo = pageNo;
                const params = {
                    pageNo,
                    pageSize: state.pageSize,
                    cityCode
                }
                return new Promise(resolve => {
                    fetchRoomList(params).then(res => {
                        const { success, result } = res
                        if (success) {
                            const { orders, total } = result
                            commit('setRoomList', orders.data)
                            console.log('保存到Vuex中', orders.data)
                            // 赋值total
                            state.total = total
                            resolve(true)
                        }
                    })
                })
            },
            // 房屋详情接口
            getRoomDetail({ commit, state }, payload: IRoomDetailParams) {
                return new Promise(resolve => {
                    fetchRoomDetail(payload).then(res => {
                        const { success, result } = res
                        if (success) {
                            commit('setRoomDetail', result)
                            console.log('详情页数据保存到Vuex中', result)
                            resolve(true)
                        }
                    })
                })
            },
        }
    })
}