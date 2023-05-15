import { createRouter, createWebHistory } from 'vue-router';
import { $t } from '@/plugins/translations';
import { $config } from '@/plugins/config';
import { $utils } from '@/plugins/utils';

let routes = [
  {
    path: $config['pages-specific'].default,
    name: $t('Ratings list'),
    component: () => import('@/views/ratings/ratings.vue'),
  },
  {
    path: '/sections',
    name: $t('Sections list'),
    component: () => import('@/views/sections/sections.vue'),
  },
  {
    path: '/ratings/create',
    name: $t('Create a new rating'),
    component: () => import('@/views/rating/rating.vue'),
  },
  {
    path: '/ratings/:ratingId',
    name: $t('Edit rating'),
    component: () => import('@/views/rating/rating.vue'),
  },
  {
    path: '/panel-control',
    name: $t('Panel control'),
    component: () => import('@/views/panel-control/panel-control.vue'),
  },
  {
    path: '/user',
    name: $t('User profile'),
    component: () => import('@/views/user/user.vue'),
  },
  {
    path: '/settings',
    name: $t('Settings'),
    component: () => import('@/views/settings/settings.vue'),
  },
  {
    path: $config['pages-specific'].login,
    name: $t('Login'),
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/',
    name: $t('Main Page'),
    redirect: (to: any) => {
      return { path: $config['pages-specific'].default };
    },
  },
  {
    path: '/:notFound(.*)',
    name: $t('Not found'),
    redirect: (to: any) => {
      return { path: $config['pages-specific'].default };
    },
  },
];

// Create routes map
export let $routesMap = {} as Record<string, { path: string; name: string }>;

for (let { path, name } of routes) {
  $routesMap[name] = {
    path,
    name,
  };
}

// Checking for duplicate names
(function () {
  let checkKeys = {} as Record<string, number>;
  for (let { name } of routes) {
    if (!checkKeys[name]) {
      checkKeys[name] = 1;
    } else {
      let error = $t('Routes must not have the same name');
      let message = `${error}: "${name}"`;
      console.error(message);
      $utils.showMessageError({ message });
    }
  }
})();

// Checking for compliance with the main menu
(function () {
  for (let name of $config['main-menu']) {
    if (!$routesMap[name]) {
      let error = $t('The router does not have a key that is used in the main menu');
      let message = `${error}: "${name}"`;
      console.error(message);
      $utils.showMessageError({ message });
    }
  }
})();

let router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
