import axios from 'axios';

let stateDefault = () => ({
  items: [],
});

export default {
  namespaced: true,
  state: stateDefault(),
  mutations: {
    setRatings(context, data) {
      context.items = data;
    },
    // Очистка store при смене страницы
    clearStore(context) {
      context.items = stateDefault();
    },
  },
  actions: {
    // Получить рейтинг по id
    async getRatings(context) {
      let { data } = await axios.get('/api/ratings/user');
      context.commit('setRatings', data);
      return data;
    },
  },
  getters: {},
};
