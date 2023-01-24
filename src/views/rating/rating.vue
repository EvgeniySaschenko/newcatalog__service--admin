<template lang="pug">
include /src/assets/pug/index.pug
+b.page--rating
  +e.H1.title {{ rating.name.ua }}
  el-tabs(v-model='tabActive')
    el-tab-pane(label='Основные настройки', name='main')
      app-tab-main
    el-tab-pane(label='Контент', name='content', :disabled='!rating.id')
      app-tab-content
    el-tab-pane(label='Ярлыки', name='labels', :disabled='!rating.id')
      app-tab-labels
    // lazy - нужен чтобы не съезжала картинка
    el-tab-pane(label='Изображения', name='images', :disabled='!rating.id')
      app-tab-images(:rating='rating', v-if='tabActive == "images"')
</template>

<script>
import TabMain from './tab-main.vue';
import TabContent from './tab-content.vue';
import TabLabels from './tab-labels.vue';
import TabImages from './tab-images.vue';

export default {
  name: 'page-rating',
  mounted() {
    this.init();
  },

  beforeUnmount() {
    this.$store.commit('page-rating/clearStore');
  },

  watch: {
    tabActive() {
      this.setTabUrlParam(this.tabActive);
    },
  },

  components: {
    AppTabMain: TabMain,
    AppTabContent: TabContent,
    AppTabLabels: TabLabels,
    AppTabImages: TabImages,
  },

  data() {
    return {
      // Активный таб
      tabActive: 'main',
    };
  },

  computed: {
    // Данные рейтинга
    rating() {
      return this.$store.state['page-rating'];
    },
  },

  methods: {
    async init() {
      let { id } = this.$route.params;
      let { tab } = this.$route.query;

      if (id !== 'create') {
        try {
          let rating = await this.$store.dispatch('page-rating/getRating', id);
          await this.$store.dispatch('page-rating/getLabels', id);
          await this.$store.dispatch('page-rating/getRatingItems', {
            ratingId: id,
            typeSort: rating.typeSort,
          });
        } catch (error) {
          console.error(error);
        }
      }

      if (tab) {
        this.tabActive = tab;
      }
    },
    // Добавить query параметры табу
    setTabUrlParam(tabActive) {
      this.$router.push({ query: { tab: [tabActive] } });
    },
  },
};
</script>

<style lang="sass" scoped>
.page
  &__title
    display: flex
    justify-content: space-between
  &__box-arrow
    justify-content: space-between
  &__box-arrow
    display: flex
    justify-content: space-between
  &__arrow
    font-size: 25px
    cursor: pointer
  &__tag-processing-status
    margin-right: 10px
  &__alert-send-status
    margin-bottom: 10px
</style>
