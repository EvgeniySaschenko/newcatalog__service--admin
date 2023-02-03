import { createApp } from 'vue';
import App from '@/app.vue';
import '@/registerServiceWorker';
import router from '@/router';
import { VueCookieNext } from 'vue-cookie-next';
import 'bootstrap/dist/css/bootstrap-utilities.css';

// Plugins
import pluginApi from '@/plugins/api';
import pluginUtils from '@/plugins/utils';
import pluginElementPlus from '@/plugins/element-plus';
import pluginI18n from '@/plugins/i18n';
import pinia from '@/plugins/pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

let app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  let name = `${key}`.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();
  app.component(`el-icon-${name}`.toLowerCase(), component);
}

app
  .use(pinia)
  .use(pluginI18n)
  .use(pluginApi)
  .use(pluginUtils)
  .use(pluginElementPlus)
  .use(VueCookieNext)
  .use(router)
  .mount('#app');
