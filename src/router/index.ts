import { createRouter, createWebHistory } from 'vue-router';

let routes = [
  {
    path: '/ratings',
    name: 'Список рейтингов',
    component: () => import('@/views/ratings/ratings.vue'),
  },
  {
    path: '/sections',
    name: 'Список разделов',
    component: () => import('@/views/sections/sections.vue'),
  },
  {
    path: '/ratings/:ratingId',
    name: 'Редактировать рейтинг',
    component: () => import('@/views/rating/rating.vue'),
  },
  {
    path: '/cache',
    name: 'Управление кешем',
    component: () => import('@/views/cache/cache.vue'),
  },
  {
    path: '/user',
    name: 'Настройки пользователя',
    component: () => import('@/views/user/user.vue'),
  },
  {
    path: '/login',
    name: 'Логин',
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/',
    name: 'Home',
    redirect: (to: any) => {
      return { path: '/ratings' };
    },
  },
];

let router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
