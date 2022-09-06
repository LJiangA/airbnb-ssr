<script setup lang="ts">
import { useStore } from '@/store'
import Pagination from '@/components/common/pagination.vue'
import HomeTabs from './homeTabs.vue'
import { IRoomListParams } from '@/api/interface'
import { useRouter } from 'vue-router'

const store = useStore();
const router = useRouter();
// 跳转至详情页
function toDetail(item: any) {
    console.log(item);
    const { id } = item;
    store.commit('setRoomId', id)
    router.push({ path: `/roomDetail/${id}` })
}
// 分页器点击事件的回调函数
function handleChangePage(pageNo: number) {
    console.log('父组件', pageNo)
    store.dispatch('getRoomList', { pageNo } as IRoomListParams)
}
</script>

<template>
    <!-- 城市筛选 -->
    <HomeTabs></HomeTabs>

    <!-- 首页列表数据 -->
    <div>
        <div class="home-list">
            <div class="item" v-for="item in store.state.roomList" :key="item.id" @click="toDetail(item)" >
                <img :src="item.pictureUrl" :alt="item.title" />
                <p class="title">{{ item.title }}</p>
                <p class="price">¥{{ item.price }}元</p>
            </div>
        </div>
    </div>

    <!-- 分页器 -->
    <Pagination @changePage="handleChangePage"></Pagination>
</template>

<style scoped>
</style>