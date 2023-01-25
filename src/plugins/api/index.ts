import user from './user';
import sections from './sections';
import ratings from './ratings';
import ratingsLabels from './ratings-labels';
import ratingsItems from './ratings-items';

export let $api = {
  user,
  sections,
  ratings,
  'ratings-labels': ratingsLabels,
  'ratings-items': ratingsItems,
};

// Доступ к $api через this в компонетах
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
