import VueLazyLoad from 'vue3-lazyload';

let options = {
  loading: '',
  error: '',
  lifecycle: {
    loading: (el: any) => {},
    error: (el: any) => {},
    loaded: (el: any) => {},
  },
  observerOptions: {
    rootMargin: '100px 0px 100px 0px',
  },
};

export default { VueLazyLoad, options };
