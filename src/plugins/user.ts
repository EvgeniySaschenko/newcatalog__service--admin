import $router from '@/router';
import { reactive } from 'vue';

// The page the user will be directed to after logging in
let pageDefault = '/ratings';
// Login page
let pageLogin = '/login';
// Time after which it is necessary to refresh the token
let refreshTockenTime = 300; // sec
// If the user has been idle this time, you must log out
let userIdleTime = 1200; // sec

export let $user = reactive({
  pageDefault,
  pageLogin,
  isPageLogin: pageLogin === location.pathname,
  refreshTockenTime,
  userIdleTime,
});

$router.afterEach((to, from, next) => {
  $user.isPageLogin = pageLogin === to.path;
});

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $user: typeof $user;
  }
}

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$user = $user;
  },
};
