import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import TDesign from 'tdesign-vue-next';
import { router } from '@/route/index';

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';
createApp(App).use(router).use(TDesign).mount('#app');
