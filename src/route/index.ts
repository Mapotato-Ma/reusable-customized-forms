import { createRouter, createWebHistory } from 'vue-router';
import ViewsEntranceComponent from '@/views-entrance/views-entrance.vue';
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: ViewsEntranceComponent },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
