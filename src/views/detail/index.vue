<script lang="ts">
import { defineComponent, watch, watchEffect } from 'vue'
import Detail from './components/detail.vue'
import { IRoomDetailParams } from '@/api/interface'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
    components: { Detail },
    setup() {
        const router = useRouter()
        console.log('setup-----router', router)
        const route = useRoute()
        const store = useStore()
        // watch(() => route.params, (newVal, oldVal) => {
        //     store.dispatch('getRoomDetail', newVal)
        // })
        watchEffect(() => store.dispatch('getRoomDetail', route.params))
    },
    asyncData({ route, store }: any) {
        console.log('asyncData----详情页', store, route);
        const { roomId } = store.state
        const id = Number(route.value.params.id)
        // 刷新页面时，会出现 roomId 为null，因此需要用路由的params上的id来代替，以免出错
        return store.dispatch('getRoomDetail', { id: roomId || id } as IRoomDetailParams)
    },
})
</script>

<template>
    <Detail></Detail>
</template>

<style lang="scss">
@import "@/assets/scss/detail/index.scss";
</style>