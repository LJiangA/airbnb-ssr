module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: [
        'vue',
        '@typescript-eslint'
    ],
    rules: {
        // 语句强制分号结尾
        semi: 'off',
        // 缩进风格
        indent: [2, 4],
        // 关闭命名规则校验
        'vue/multi-word-component-names': 'off',
        // 解决意外的尾随逗号
        'comma-dangle': 0,
        // 关闭函数定义时括号前面要不要有空格的校验
        'space-before-function-paren': 'off',
        // 关闭在函数标识符和其调用之间有空格的校验
        'func-call-spacing': 0,
        // 取消最后一个空行规则的校验
        'eol-last': 0,
    },
};