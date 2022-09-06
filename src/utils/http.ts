import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const defaultConfig = {
    timeout: 5000,
    baseURL: import.meta.env.PROD ? 'http://110.42.184.111' : 'http://localhost:3000',
};

class Http {
    // 定义私有属性
    // 创建axios实例
    private static axiosInstance = axios.create(defaultConfig);

    constructor() {
        this.httpInterceptorsRequest();
        this.httpInterceptorsResponse();
    }

    // 定义私有方法
    // 请求拦截器
    private httpInterceptorsRequest() {
        Http.axiosInstance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                return config;
            },
            err => {
                return Promise.reject(err);
            }
        );
    }

    // 响应拦截器
    private httpInterceptorsResponse() {
        Http.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            err => {
                return Promise.reject(err);
            }
        );
    }

    // 对外暴露的方法
    // 封装get和post请求
    public httpRequestGet<T>(url: string, params: AxiosRequestConfig): Promise<T> {
        return Http.axiosInstance.get(url, { params }).then(res => res.data).catch();
    }

    public httpRequestPost<T>(url: string, params: AxiosRequestConfig): Promise<T> {
        return Http.axiosInstance.post(url, params).then(res => res.data).catch();
    }
}

export default new Http();