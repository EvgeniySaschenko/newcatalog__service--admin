import { createApp } from 'vue';
import App from '@/app.vue';
import '@/registerServiceWorker';
import router from '@/router';
import { VueCookieNext } from 'vue-cookie-next';
import 'bootstrap-icons/font/bootstrap-icons.css';

import store from '@/store';
import VueAxios from 'vue-axios';
import axios from 'axios';

// Plugins
import pluginApi from '@/plugins/api';
import pluginUtils from '@/plugins/utils';
import pluginElementPlus from '@/plugins/element-plus';
import pluginI18n from '@/plugins/i18n';
import pinia from '@/plugins/pinia';

let app = createApp(App)
  .use(pinia)
  .use(pluginI18n)
  .use(VueAxios, axios)
  .use(pluginApi)
  .use(pluginUtils)
  .use(pluginElementPlus)
  .use(VueCookieNext)
  .use(store)
  .use(router)
  .mount('#app');
