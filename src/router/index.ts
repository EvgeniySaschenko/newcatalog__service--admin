import { createRouter, createWebHistory } from 'vue-router';
import { VueCookieNext } from 'vue-cookie-next';
let isAuth = VueCookieNext.getCookie('user');

isAuth = true;

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
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login.vue'),
  },
];

let router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Если пользователь не авторизирован
router.beforeEach((to, from, next) => {
  VueCookieNext.setCookie('user', JSON.stringify({ id: 1 }));
  if (!isAuth && to.name !== 'Login') {
    //next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
