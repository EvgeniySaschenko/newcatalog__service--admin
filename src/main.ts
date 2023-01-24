import { createApp } from 'vue';
import App from './app.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import VueAxios from 'vue-axios';
import axios from 'axios';
import { VueCookieNext } from 'vue-cookie-next';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

let i18n = {
  install: (app: any) => {
    app.config.globalProperties.$t = (key: string) => {
      return key;
    };
  },
};

let app = createApp(App)
  .use(i18n)
  .use(VueAxios, axios)
  .use(ElementPlus)
  .use(VueCookieNext)
  .use(store)
  .use(router)
  .mount('#app');
