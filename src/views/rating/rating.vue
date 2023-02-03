<template lang="pug">
include /src/mixins.pug

+b.page--rating.container
  +e.H1.title {{ ratingId ? $t("Редактировать рейтинг") : $t("Создать новый рейтинг") }}
  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Основные настройки")', name='main')
      tab-main(v-if='tabActive == "main"', :ratingId='ratingId')
    el-tab-pane(:label='$t("Контент")', name='content', :disabled='!ratingId')
      tab-content(v-if='tabActive == "content"', :ratingId='ratingId')
    el-tab-pane(:label='$t("Ярлыки")', name='labels', :disabled='!ratingId')
      tab-labels(v-if='tabActive == "labels"', :ratingId='ratingId')
    el-tab-pane(:label='$t("Изображения")', name='images', :disabled='!ratingId')
      tab-images(v-if='tabActive == "images"', :ratingId='ratingId')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabMain from './tab-main.vue';
import TabContent from './tab-content.vue';
import TabLabels from './tab-labels.vue';
import TabImages from './tab-images.vue';

type TabsType = 'main' | 'content' | 'labels' | 'images';

export default defineComponent({
  name: 'page-rating',

  components: {
    TabMain,
    TabContent,
    TabLabels,
    TabImages,
  },

  mounted() {
    this.init();
  },

  data() {
    return {
      // Curent active tab
      tabActive: 'main' as TabsType,
    };
  },

  computed: {
    ratingId() {
      let { ratingId } = this.$route.params;
      return ratingId === 'create' ? null : +ratingId;
    },
  },

  methods: {
    // Init
    async init() {
      this.setActiveTab();
    },

    // Makes tab active depending on query params url
    setActiveTab() {
      let { tab } = this.$route.query;
      this.tabActive = (tab as TabsType) || this.tabActive;
    },

    // Add query parameters to url when changing tabs
    setTabUrlParam() {
      this.$router.push({ query: { tab: [this.tabActive] } });
    },
  },
});
</script>

<style lang="sass" scoped></style>
