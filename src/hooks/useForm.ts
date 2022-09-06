import { reactive, getCurrentInstance } from 'vue';
import { userSignApi, userLoginApi } from '@/api/login';
import { IResultOr } from '@/api/interface';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';

// 定义一个接口,规范类型
interface IRuleForm {
    phone: string;
    password: string;
}

// 对外暴露一个函数useForm,该函数既可以返回一些参数，也可以接收传入的参数
export default function useForm(t: any, router: any) {
    const { proxy }: any = getCurrentInstance();
    const store = useStore();
    const route = useRoute()
    const ruleForm: IRuleForm = reactive({
        phone: '',
        password: ''
    });
    const rules = reactive({
        phone: [
            {
                required: true,
                min: 11,
                max: 11,
                message: t('login.placePhone'),
                trigger: 'blur'
            },
        ],
        password: [
            {
                required: true,
                message: t('login.placePass'),
                trigger: 'blur'
            },
        ]
    })

    // 注册接口
    function userSign(params: IRuleForm) {
        userSignApi(params).then((res: IResultOr) => {
            const { success, message } = res;
            if (success) {
                proxy.$message.success(message);
            } else {
                proxy.$message.error(message);
            }
        })
    }
    // 登录接口
    function userLogin(params: IRuleForm) {
        userLoginApi(params).then((res: IResultOr) => {
            const { success, message, result } = res;
            if (success) { // 登录成功
                const { status, userId } = result;
                // 存储该登录用户的userId于本地浏览器中
                localStorage.setItem('userId', userId);
                // 修改仓库中的用户状态为已登录状态
                store.commit('setUserStatus', status);
                proxy.$message.success(message);
                // 登录成功时，跳转到之前重定向的页面或者首页home
                // 若重定向的页面为空，则跳转到首页
                const { redirect }: any = route.query
                router.push({ path: redirect || '/home' })
            } else {
                proxy.$message.error(message);
            }
        })
    }

    // 要return出去
    return {
        // 属性
        proxy,
        ruleForm,
        rules,
        // 方法
        userSign,
        userLogin
    }
}