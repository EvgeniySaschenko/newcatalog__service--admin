import { createRouter, createWebHistory } from 'vue-router';
import { PagesKeys } from '@/types';

let routes = [
  {
    path: '/ratings',
    name: PagesKeys['Ratings list'],
    component: () => import('@/views/ratings/ratings.vue'),
  },
  {
    path: '/sections',
    name: PagesKeys['Sections list'],
    component: () => import('@/views/sections/sections.vue'),
  },
  {
    path: '/ratings/create',
    name: PagesKeys['Create a new rating'],
    component: () => import('@/views/rating/rating.vue'),
  },
  {
    path: '/ratings/:ratingId',
    name: PagesKeys['Edit rating'],
    component: () => import('@/views/rating/rating.vue'),
  },
  {
    path: '/cache',
    name: PagesKeys['Cache control'],
    component: () => import('@/views/cache/cache.vue'),
  },
  {
    path: '/user',
    name: PagesKeys['User profile'],
    component: () => import('@/views/user/user.vue'),
  },
  {
    path: '/settings',
    name: PagesKeys['App Settings'],
    component: () => import('@/views/settings/settings.vue'),
  },
  {
    path: '/login',
    name: PagesKeys['Login'],
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/',
    name: PagesKeys['Home'],
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
