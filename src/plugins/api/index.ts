import users from './users';
import sections from './sections';
import ratings from './ratings';
import labels from './labels';
import ratingsItems from './ratings-items';
import sites from './sites';
import cache from './cache';
import settings from './settings';
import translations from './translations';
import backups from './backups';
import sslCertificates from './ssl-certificates';

export let $api = {
  users,
  sections,
  ratings,
  labels,
  'ratings-items': ratingsItems,
  sites,
  cache,
  settings,
  translations,
  backups,
  'ssl-certificates': sslCertificates,
};

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: typeof $api;
  }
}

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$api = $api;
  },
};
