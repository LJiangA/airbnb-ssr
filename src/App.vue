<script setup lang="ts">
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import { useRoute } from 'vue-router';
import { useStore } from './store';

// const router = useRouter();
const route = useRoute();
const store = useStore();
console.log(route);

// 网站刚打开时应该默认为中文，这里有点bug
// const lang = ref(null);
// ES6 对象的解构赋值获取locale属性
// const { locale } = useI18n();
// const changeLang = (language: any) => {
//     lang.value = language;
//     // console.log(language);
//     // 实现点击切换语言
//     locale.value = language.name;
// };
</script>

<template>
    <el-config-provider :locale="store.state.locale">
        <!-- 头部 -->
        <Header v-show="route.fullPath.indexOf('login') === -1"></Header>
        <!-- 主体 -->
        <div class="container">
            <router-view></router-view>
        </div>
        <!-- 底部 -->
        <Footer v-show="route.fullPath.indexOf('login') === -1"></Footer>
    </el-config-provider>
</template>

<style lang="scss">
#app {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>