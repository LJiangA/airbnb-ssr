<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useForm from '@/hooks/useForm';

const { t } = useI18n();
const router = useRouter();
const { ruleForm, rules, userSign, userLogin } = useForm(t, router);
const activeName = ref('login');
const loginText = ref(t('login.loginBtn'));
const ruleFormRef = ref();

// 切换按钮的回调函数
function handleClick (e: any) {
    console.log(e);
    // 获取登录/注册的切换按钮名字(login/sign)
    const { name } = e.props
    // 修改按钮文本
    loginText.value = t(`login['${name}Btn']`)
}
// 提交按钮的回调函数
function submitForm() {
    // 验证表单的值是否有效
    ruleFormRef.value.validate((valid: any) => {
        // 如果有效，则登录/注册
        if (valid) {
            if (activeName.value === 'sign') {
                userSign(ruleForm)
            } else if (activeName.value === 'login') {
                userLogin(ruleForm)
            }
        } else {
            return false
        }
    });
}

</script>

<template>
    <div class="login-page">
        <div class="left-part"></div>
        <div class="right-part">
            <div class="login-panel">
                <!-- tabs组件 -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="t('login.loginTab')" name="login"></el-tab-pane>
                    <el-tab-pane :label="t('login.signTab')" name="sign"></el-tab-pane>
                </el-tabs>
                <!-- 表单组件 -->
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
                    <el-form-item prop="phone">
                        <el-input v-model="ruleForm.phone" :placeholder="t('login.placePhone')" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="ruleForm.password" :placeholder="t('login.placePass')" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="submitForm">{{ loginText }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/scss/login/index.scss';
</style>