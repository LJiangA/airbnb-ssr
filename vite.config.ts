import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vitePluginCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vitePluginCompression(),
        // AutoImport({
        //     resolvers: [ElementPlusResolver()]
        // }),
        // Components({
        //     resolvers: [ElementPlusResolver()]
        // })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    css: {
        preprocessorOptions: {
            // 配置sass
            scss: {
                additionalData: '@import "@/assets/scss/variable.scss"; @import "@/assets/scss/main.scss";'
            },
        }
    },
    server: {
        host: 'localhost',
        port: 3000,
        proxy: {
            '/api': { // 匹配所有以'/api'开头的请求路径
                target: 'http://110.42.184.111'
            }
        }
    }
});