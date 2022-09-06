import { AxiosRequestConfig } from 'axios'

// 定义interface规范返回结果的类型
export interface IResultOr {
    code: string,
    success: boolean,
    message: string,
    result: any
}

// 定义interface规范返回结果的类型
export interface IRoomListParams extends AxiosRequestConfig {
    pageNo: number,
    pageSize: number,
    cityCode: string,
}

// 定义interface规范返回结果的类型
export interface IRoomDetailParams extends AxiosRequestConfig {
    id: number
}