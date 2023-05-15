import VueLazyLoad from 'vue3-lazyload';

let options = {
  observerOptions: {
    rootMargin: '100px 0px 100px 0px',
  },
};

// The function is needed because the options must be set after the plugin is initialized
export let $setLazyLoadOptions = (optionsCustom: Record<string, any>, context: any) => {
  Object.assign(options, optionsCustom);
  Object.assign(context.$root.$.appContext.config.globalProperties.$Lazyload.options, options);
};

export default { VueLazyLoad, options };
