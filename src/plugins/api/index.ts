import user from './user';
import sections from './sections';
import ratings from './ratings';
import labels from './labels';
import ratingsItems from './ratings-items';
import sites from './sites';
import cache from './cache';
import settings from './settings';

export let $api = {
  user,
  sections,
  ratings,
  labels,
  'ratings-items': ratingsItems,
  sites,
  cache,
  settings,
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
