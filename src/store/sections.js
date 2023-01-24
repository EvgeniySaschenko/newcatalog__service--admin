import axios from 'axios';

export default {
  namespaced: true,
  state: () => ({
    items: [],
  }),
  mutations: {
    setSections(context, data) {
      context.items = data;
    },
  },
  actions: {
    // Получить все разделы
    async getSections(context) {
      let { data } = await axios.get('/api/sections/');
      context.commit('setSections', data);
      return data;
    },

    // Добавить раздел
    async createSection(context, name) {
      let { data } = await axios.post('/api/sections/', { name });
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getSections');
      return data;
    },

    // Удалить раздел
    async deleteSection(context, id) {
      let { data } = await axios.delete('/api/sections/', { data: { id } });
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getSections');
      return data;
    },

    // Редактировать раздел
    async editSection(context, section) {
      let { data } = await axios.put('/api/sections/', section);
      if (data.errors) return Promise.reject(data.errors);
      context.dispatch('getSections');
      return data;
    },
  },
  getters: {},
};
