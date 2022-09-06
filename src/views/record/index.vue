<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { fetchRecordApi } from '@/api/record';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const recordData = ref()
// const data = reactive({
//     recordData: []
// })
const { proxy }: any = getCurrentInstance()
const store = useStore()
const router = useRouter()
const loading = ref(true) // loading的初始化值是布尔值true
// 获取历史足迹数据
function fetchRecord() {
    fetchRecordApi().then(res => {
        const { success, message, result } = res
        if (success) {
            // 获取到数据后将 loading 的值改为false
            loading.value = false
            // proxy.$message.success(message)
            recordData.value = result
            // data.recordData = result
        } else {
            proxy.$message.error(message)
        }
    })
}
// 使用 onMounted 钩子函数判断当前页面是服务端渲染还是客户端渲染
onMounted(() => {
    // 登录权限拦截
    if (store.state.userStatus) {
        fetchRecord()
    } else {
        // 拿到当前页面的路径，这个可以通过在 window.location 或者 route.fullPath 对象上拿到
        const { pathname } = window.location
        // const path = route.fullPath
        // console.log(window.location, pathname, route, path)
        // 跳转到登录页面，在登录后再跳转到之前的页面
        router.replace({
            path: '/login',
            query: {
                // 页面重定向
                redirect: pathname
            }
        })
    }
})

// 点击跳转至详情页
function toDetail(item: any) {
    const { recordId: id } = item;
    store.commit('setRoomId', id)
    router.push({ path: `/roomDetail/${id}` })
}
</script>

<template>
    <div class="record-page">
        <div class="main-wrapper">
            <el-skeleton :loading="loading" animated>
                <!-- 骨架屏结构和CSS样式 -->
                <template #template>
                    <div class="column-style">
                        <div class="item" v-for="i in 9" :key="i" >
                            <el-skeleton-item variant="image" style="width:315px;height:240px;border-radius:5px"></el-skeleton-item>
                            <el-skeleton-item variant="p" style="width:100%;margin-top: 15px;"></el-skeleton-item>
                            <el-skeleton-item variant="p" style="width:30%;"></el-skeleton-item>
                        </div>
                    </div>
                </template>
                <!-- 真实DOM结构和CSS样式 -->
                <template #default>
                    <div class="column-style" v-if="recordData.length > 0">
                        <div class="item" v-for="(item, index) in recordData" :key="index" @click="toDetail(item)">
                            <el-image :src="item.pictureUrl" :alt="item.title"></el-image>
                            <p class="title">{{ item.title }}</p>
                            <p class="price">¥ {{ item.price }}</p>
                        </div>
                    </div>
                    <el-empty v-else description="暂无浏览记录哦~"></el-empty>
                </template>
            </el-skeleton>
        </div>
    </div>
</template>

<style scoped lang="scss">
.record-page {
    .main-wrapper {
        @include main-wrapper(30px);
        .column-style {
            column-count: 3;
            .item {
                width: 315px;
                overflow: hidden;
                margin-bottom: 25px;
                cursor: pointer;
                text-align: center;
                display: inline-block;
                img {
                    width: 315px;
                    height: auto;
                    border-radius: 4px;
                }
                .title {
                    width: 315px;
                    font-size: 18px;
                    margin: 15px 0;
                    font-weight: bold;
                }
                .price {
                    font-size: 16px;
                }
            }
        }
    }
}
</style>