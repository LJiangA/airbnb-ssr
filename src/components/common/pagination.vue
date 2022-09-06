<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore();
const pageNo = computed(() => store.state.pageNo)
const pageSize = computed(() => store.state.pageSize)
const total = computed(() => store.state.total)
const emit = defineEmits<{
    (e: 'changePage', pageNo: number): void
}>()
function changePage(pageNo: number) {
    console.log('子组件', pageNo);
    emit('changePage', pageNo);
}
</script>

<template>
    <el-pagination
        v-model:currentPage="pageNo"
        :pageSize="pageSize"
        :total="total"
        background
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        @current-change="changePage">
    </el-pagination>
</template>

<style scoped>
</style>