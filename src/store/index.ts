import { createStore } from 'vuex';

export default createStore({
  modules: {
    user: require('./user').default,
    sections: require('./sections').default,
    'page-rating': require('./page-rating').default,
    'page-ratings': require('./page-ratings').default,
  },
});
