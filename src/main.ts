import { createApp } from 'vue';
import App from '@/app.vue';
import '@/registerServiceWorker';
import router from '@/router';
import { VueCookieNext } from 'vue-cookie-next';

// Plugins
import pluginApi from '@/plugins/api';
import pluginUtils from '@/plugins/utils';
import pluginElementPlus from '@/plugins/element-plus';
import pluginTranslations from '@/plugins/translations';
import pinia from '@/plugins/pinia';
import user from '@/plugins/user';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

let app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  let name = `${key}`.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();
  app.component(`el-icon-${name}`.toLowerCase(), component);
}

app
  .use(pinia)
  .use(pluginTranslations)
  .use(pluginApi)
  .use(pluginUtils)
  .use(pluginElementPlus)
  .use(VueCookieNext)
  .use(user)
  .use(router)
  .mount('#app');
