<script setup lang="ts">
import { useStore } from '@/store'
import { ref, reactive, computed, getCurrentInstance, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router';
import { saveOrderApi } from '@/api/order'
import { saveRecordApi } from '@/api/record';

const store = useStore();
const roomDetail = computed(() => store.state.roomDetail)
const orderForm = reactive({ personNumber: 1 })
const ruleForm = ref()
const { proxy }: any = getCurrentInstance()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
onMounted(() => {
    saveRecord(); // 进入详情页时就保存浏览记录
})

function submitForm() {
    // 登录权限拦截
    if (store.state.userStatus) {
        saveOrder()
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
}
// 立即预定
function saveOrder() {
    const { id: orderId } = route.params
    const { title, price, imgs } = roomDetail.value
    const { personNumber } = orderForm
    const params = {
        orderId,
        title,
        price,
        personNumber,
        pictureUrl: imgs[0]
    }
    saveOrderApi(params).then((res) => {
        console.log(res)
        const { success, message } = res
        if (success) {
            proxy.$message.success('预定成功')
        } else {
            proxy.$message.error(message)
        }
    })
}
// 保存历史足迹
function saveRecord() {
    const { id: recordId } = route.params
    const { title, price, personNumber, imgs } = roomDetail.value
    const params = {
        recordId,
        title,
        price,
        personNumber,
        pictureUrl: imgs[0]
    }
    saveRecordApi(params).then((res) => {
        console.log(res)
        const { success, message } = res
        if (success) {
            proxy.$message.success('记录成功')
        } else {
            proxy.$message.error(message)
        }
    })
}
</script>

<template>
    <!-- 照片墙 -->
    <el-carousel trigger="click" height="380px" :interval="3000"
        indicator-position="none" type="card" >
        <el-carousel-item v-for="(item, index) in roomDetail.imgs" :key="index">
            <img :src="item" alt="index" >
        </el-carousel-item>
    </el-carousel>
    <!-- 房屋详情信息 -->
    <div class="room-detail">
        <!-- 左侧内容 -->
        <div class="detail-part">
            <h2>{{ roomDetail.title }}</h2>
            <div class="info">
                <span class="room">{{ roomDetail.info.room }} {{ t('detail.rooms') }}</span>
                <span class="bed">{{ roomDetail.info.bed }} {{ t('detail.beds') }}</span>
                <span class="toilet">{{ roomDetail.info.toilet }} {{ t('detail.bathrooms') }}</span>
                <span class="live-number">{{ t('detail.living') }} {{ roomDetail.info.liveNumber }} {{ t('detail.personNumber') }}</span>
            </div>
            <div class="tags">
                <el-tag size="small">
                    {{ roomDetail.info.remarks }} {{ t('detail.remarks') }}
                </el-tag>
                <el-tag size="small" class="ml-10" type="danger" v-if="roomDetail.info.metro" >
                    {{ t('detail.nearSubway') }}
                </el-tag>
                <el-tag size="small" class="ml-10" type="warning" v-if="roomDetail.info.parking" >
                    {{ t('detail.freeParking') }}
                </el-tag>
                <el-tag size="small" class="ml-10" type="success" v-if="roomDetail.info.luggage" >
                    {{ t('detail.luggage') }}
                </el-tag>
            </div>
            <!-- 房东信息 -->
            <div class="owner-detail">
                <img :src="roomDetail.owner.avatar" />
                <div class="info">
                    <p>{{ t('detail.landlord') }}: {{ roomDetail.owner.name }}</p>
                    <p>
                        <span v-if="roomDetail.owner.certify">{{ t('detail.authenticated') }}</span>
                        <span v-if="roomDetail.info.goodOwner">{{ t('detail.greatlandlord') }}</span>
                    </p>
            </div>
            </div>
            <!-- 基本介绍 -->
            <div class="introduce">{{ roomDetail.owner.introduce }}</div>
        </div>
        <!-- 右侧表单 -->
        <div class="form-part">
            <p class="price">
                <span>¥ {{ roomDetail.price }}</span>
                / {{ t('detail.night') }}
            </p>
            <!-- 表单 -->
            <el-form ref="ruleForm" :model="orderForm" label-position="top" class="order-ruleForm">
                <el-form-item prop="personNumber" :label="t('detail.personNumber')">
                    <select v-model="orderForm.personNumber">
                        <option v-for="item in 3" :value="item" :key="item">{{ item }}</option>
                    </select>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn-primary" type="primary" @click="submitForm">
                        {{ t('detail.order') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss">
</style>