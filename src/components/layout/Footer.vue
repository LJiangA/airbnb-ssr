<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n';

// 使用I18n实现国际化语言切换
const { t } = useI18n();
const footerMenu = reactive([
    {
        title: 'airbnb',
        menus: [
            {
                name: 'careers',
                link: '#'
            },
            {
                name: 'news',
                link: '#'
            },
            {
                name: 'topic',
                link: '#'
            },
            {
                name: 'diversity',
                link: '#'
            },
            {
                name: 'accessibility',
                link: '#'
            }
        ]
    },
    {
        title: 'discovery',
        menus: [
            {
                name: 'trustAndSafe',
                link: '#'
            },
            {
                name: 'invite',
                link: '#'
            },
            {
                name: 'evection',
                link: '#'
            },
            {
                name: 'magazine',
                link: '#'
            },
            {
                name: 'airbnbOrg',
                link: '#'
            }
        ]
    },
    {
        title: 'rent',
        menus: [
            {
                name: 'whyRent',
                link: '#'
            },
            {
                name: 'hospitality',
                link: '#'
            },
            {
                name: 'responsibleHosting',
                link: '#'
            },
            {
                name: 'experiences',
                link: '#'
            },
            {
                name: 'resources',
                link: '#'
            }
        ]
    },
    {
        title: 'service',
        menus: [
            {
                name: 'help',
                link: '#'
            },
            {
                name: 'neighbors',
                link: '#'
            }
        ]
    },
])
</script>

<template>
    <div class="footer-common">
        <div class="inner-footer">
            <ul>
                <li v-for="(item, index) in footerMenu" :key="index">
                    <h3>{{ t(`footer['${item.title}']`) }}</h3>
                    <a v-for="(menu, i) in item.menus" :key="i" :href="menu.link" >{{ t(`footer['${menu.name}']`) }}</a>
                </li>
            </ul>
            <div class="copy-right">@ 2022 Harry, Inc . All rights reserved.</div>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/scss/layout/footer.scss';
</style>