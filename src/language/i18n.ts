import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';

// 对外暴露封装好的 createSSRI18n 函数
export function createSSRI18n() {
    // 创建实例 i18n
    return createI18n({
        // 修复 Not available in legacy mode 错误
        legacy: false,
        // 默认语言
        locale: 'zh',
        // 放置自定义的语言包
        messages: {
            zh,
            en
        }
    });
}