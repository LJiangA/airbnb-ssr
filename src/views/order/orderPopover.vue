<script setup lang="ts">
import { reactive, getCurrentInstance } from 'vue'
import { fetchOrderApi } from '@/api/order'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';

let orderData = reactive<Array<any>>([])
const { proxy }: any = getCurrentInstance()
const store = useStore()
const router = useRouter()
const { t } = useI18n()
// 获取订单中心的房屋列表数据
function fetchOrder() {
    // 由于 orderPopover是个异步组件，因此必须要return 一个Promise对象
    return fetchOrderApi().then((res) => {
        console.log(res)
        const { success, message, result } = res
        if (success) {
            orderData = result
        } else {
            proxy.$message.error(message)
        }
    })
}
// 登录权限拦截
if (store.state.userStatus) {
    // 获取订单数据时，也需要使用await等待异步结果
    await fetchOrder()
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
    closeMask() // 关闭遮罩栏
}
// 关闭遮罩栏和popover
function closeMask() {
    store.commit('setOrderVisible', false)
}

// 点击跳转至详情页
function toDetail(item: any) {
    const { orderId: id } = item;
    store.commit('setRoomId', id)
    router.push({ path: `/roomDetail/${id}` })
}
</script>

<template>
    <Teleport to="#app">
        <div class="mask" @click="closeMask"></div>
    </Teleport>
    <ul v-if="orderData.length">
        <li v-for="(item, index) in orderData" :key="index" @click="toDetail(item)">
            <img :src="item.pictureUrl" alt="">
            <div class="mess">
                <p class="title">{{ item.title }}</p>
                <p class="info">¥{{ item.price }}/{{ t('detail.night') }} · {{ item.personNumber }}{{ t('detail.person') }}</p>
            </div>
        </li>
    </ul>
    <div class="loading-block" v-else>空空如也~</div>
</template>

<style scoped lang="scss">
ul {
  @include placeholder-order;
}
li {
  @include flex-layout(row, space-between, center);
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  &:last-child {
    border-bottom: none;
  }
  img {
    width: 65px;
    height: 45px;
    border-radius: 4px;
    margin-right: 5px;
    object-fit: cover;
  }
  .mess {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 5px;
    width: 100px;
    overflow: hidden;
    p {
      line-height: 16px;
      font-weight: normal;
      margin: 5px 0;
      max-width: 100px;
    }
    .title {
      font-weight: bold;
      color: #333;
      font-size: 14px;
      display: inline-block;
      @include line-text-overflow;
    }
    .info {
      color: #666;
      font-size: 12px;
    }
  }
}
</style>