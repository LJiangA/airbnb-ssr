<script setup lang="ts">
import { ref, getCurrentInstance, defineAsyncComponent, onMounted } from 'vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import en from 'element-plus/lib/locale/lang/en';
import { fetchLanguageApi } from '@/api/layout/index'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { userLogoutApi } from '@/api/login';
import { IResultOr } from '@/api/interface';
import { useStore } from '@/store';

// 定义异步组件
const OrderPopover = defineAsyncComponent(() => import('@/views/order/orderPopover.vue'))
const router = useRouter();
// 使用I18n实现国际化语言切换
const { t, locale } = useI18n();
const { proxy }: any = getCurrentInstance();
const store = useStore();
const activeIndex = ref('home');
// 相当于vue2的$emit触发自定义事件
// const emit = defineEmits<{
//     // e: 自定义事件, language: 参数
//     (e: 'changeLang', language: any): void;
// }>();
// 菜单栏选择的回调函数
function handleSelect(e: any) {
    // 切换语言包
    if (e === 'zh') {
        // 触发自定义事件修改语言包
        // emit('changeLang', zhCn);
        // 保存当前语言包
        // saveLanguage('zh');
        store.dispatch('saveLang', zhCn);
        locale.value = e;
    } else if (e === 'en') {
        // emit('changeLang', en);
        // saveLanguage('en');
        store.dispatch('saveLang', en);
        locale.value = e;
    } else if (e === 'login') {
        // 跳转到登录页面
        router.push({ name: 'login' });
    } else if (e === 'logout') {
        // 退出登录,跳转到登录页面
        userLogout();
    } else if (e === 'orders') {
        // 显示订单中心
        store.commit('setOrderVisible', true)
    } else if (e === 'records') {
        router.push({ path: '/record' })
    } else {
        router.push({ path: '/home' })
    }
}

// mock接口获取当前语言包
function getLanguage() {
    fetchLanguageApi().then(res => {
        const { success, result } = res
        // 如果数据库内有语言,则success为true 且 result不为空, 此时查询成功; 否则查询失败
        if (success && result) {
            const { name } = result;
            // 切换语言包
            if (name === 'zh') {
                // emit('changeLang', zhCn);
                store.dispatch('saveLang', zhCn)
                locale.value = name
            } else if (name === 'en') {
                // emit('changeLang', en);
                store.dispatch('saveLang', en)
                locale.value = name
            }
        }
    })
}
// 使用 onMounted 钩子函数判断当前页面是服务端渲染还是客户端渲染
onMounted(() => {
    getLanguage(); // 获取当前语言包
})
// setTimeout(() => {
//     getLanguage()
// }, 100)

// 用户退出登录
function userLogout() {
    userLogoutApi().then((res: IResultOr) => {
        const { success, message } = res;
        if (success) {
            proxy.$message.success(message);
            // 修改仓库中的用户登录状态为未登录状态
            store.commit('setUserStatus', 0);
            // 删除本地浏览器上的 userId 数据
            localStorage.removeItem('userId')
            // 跳转到登录页面重新登录
            router.push({ path: '/login' });
        } else {
            proxy.$message.error(message);
        }
    })
}
</script>

<template>
    <div class="header-common">
        <img @click="() => { router.push({ name: 'home' }) }"
            class="logo" src="../../assets/images/layout/logo.png" alt="爱此迎" />
        <el-menu :default-active="activeIndex" class="el-menu-demo"
            mode="horizontal" :ellipsis="false" @select="handleSelect">
            <el-menu-item index="home">{{ $t("header.home") }}</el-menu-item>
            <el-menu-item index="orders">
                {{ $t("header.orders") }}
                <template v-if="store.state.orderVisible">
                    <Suspense>
                        <template #default>
                            <OrderPopover></OrderPopover>
                        </template>
                        <template #fallback>
                            loading...
                        </template>
                    </Suspense>
                </template>
            </el-menu-item>
            <el-menu-item index="records">{{ $t("header.records") }}</el-menu-item>
            <el-sub-menu index="language">
                <template #title>{{ t("header.language") }}</template>
                <el-menu-item index="zh">中文</el-menu-item>
                <el-menu-item index="en">English</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="avatar" v-if="store.state.userStatus === 1">
                <template #title>
                    <img class="avatar" src="../../assets/images/layout/avatar.jpg" alt="个人中心">
                </template>
                <el-menu-item index="logout">{{ t("login.logout") }}</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="login" v-else >
                {{ t("login.loginTab") }} / {{ t("login.signTab") }}
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style lang="scss">
@import '@/assets/scss/layout/header.scss';
</style>