import axios from 'axios';

let stateDefault = () => ({
  id: null,
  sectionsIds: [],
  name: '',
  descr: '',
  isHiden: true,
  typeRating: '',
  typeDisplay: '',
  typeSort: '',
  dateCreate: '',
  labels: [],
  items: [],
  screensSites: [],
});

export default {
  namespaced: true,
  state: stateDefault(),
  mutations: {
    setRating(context, data) {
      Object.assign(context, data);
    },
    // Очистка store при смене страницы
    clearStore(context) {
      Object.assign(context, stateDefault());
    },
    // Скриншоты сайтов
    setScreensSites(context, data) {
      Object.assign(context, { screensSites: data });
    },
  },
  actions: {
    /* Основная информация */

    // Получить рейтинг по id
    async getRating(context, ratingId) {
      let { data } = await axios.get(`/api/ratings/${ratingId}`);
      context.commit('setRating', data);
      return data;
    },

    // Добавить рейтинг
    async createRating(context, rating) {
      let { data } = await axios.post('/api/ratings/', rating);
      if (data.errors) return Promise.reject(data.errors);
      context.commit('setRating', data);
      return data;
    },

    // Редактировать рейтинг
    async editRating(context, rating) {
      let { data } = await axios.put('/api/ratings/', rating);
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getRating', rating.id);
      return data;
    },

    /* Ярлыки */

    // Получить ярлыки рейтинга
    async getLabels(context, ratingId) {
      let { data } = await axios.get(`/api/ratings-labels/rating/${ratingId}`);
      if (data.errors) return Promise.reject(data.errors);
      context.commit('setRating', { labels: data });
      return data;
    },

    // Добавить ярлык
    async createLabel(context, label) {
      let { data } = await axios.post('/api/ratings-labels/', label);
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getLabels', label.ratingId);
      return data;
    },

    // Редактировать ярлык
    async editLabel(context, label) {
      let { data } = await axios.put(`/api/ratings-labels/${label.id}`, label);
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getLabels', label.ratingId);
      return data;
    },

    // Удалить ярлык
    async deleteLabel(context, label) {
      let { data } = await axios.delete(`/api/ratings-labels/${label.id}`, { data: label });
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getLabels', label.ratingId);
      return data;
    },

    /* Елементы рейтинга */

    // Получить елементы рейтинга
    async getRatingItems(context, { ratingId, typeSort }) {
      let { data } = await axios.get(`/api/ratings-items/rating/${ratingId}?typeSort=${typeSort}`);
      if (data.errors) return Promise.reject(data.errors);
      context.commit('setRating', { items: data });
      return data;
    },

    // Добавить елемент рейтинга
    async createRatingItem(context, ratingItem) {
      let { data } = await axios.post('/api/ratings-items/', ratingItem);
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getRatingItems', {
        ratingId: ratingItem.ratingId,
        typeSort: ratingItem.typeSort,
      });
      return data;
    },

    // Редактировать елемент рейтинга
    async editRatingItem(context, ratingItem) {
      let { data } = await axios.put(`/api/ratings-items/${ratingItem.id}/`, ratingItem);
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getRatingItems', {
        ratingId: ratingItem.ratingId,
        typeSort: ratingItem.typeSort,
      });
      return data;
    },

    // Удалить елемент рейтинга
    async deleteRatingItem(context, ratingItem) {
      let { data } = await axios.delete(`/api/ratings-items/${ratingItem.id}/`);
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getRatingItems', {
        ratingId: ratingItem.ratingId,
        typeSort: ratingItem.typeSort,
      });
      return data;
    },

    // Обновить ярлыки рейтинга
    async editRatingLabels(context, { labelsItems, ratingId, typeSort }) {
      let { data } = await axios.put(`/api/ratings-items/labels/`, { labelsItems: labelsItems });
      if (data.errors) return Promise.reject(data.errors);
      await context.dispatch('getRatingItems', {
        ratingId,
        typeSort,
      });
      return data;
    },

    /* Елементы рейтинга для которых есть скриншоты, которые нужно обработать */
    async getSitesSreens(context, { ratingId }) {
      let { data } = await axios.get(`/api/ratings-items/sites-screens/${ratingId}/`);
      if (data.errors) return Promise.reject(data.errors);
      context.commit('setScreensSites', data);
      return data;
    },

    // Создать логотип сайта
    async createSiteLogo(context, dataLogo) {
      let { data } = await axios.put(`/api/ratings-items/sites-logos`, dataLogo);
      if (data.errors) return Promise.reject(data.errors);
      return data;
    },
  },
  getters: {},
};
