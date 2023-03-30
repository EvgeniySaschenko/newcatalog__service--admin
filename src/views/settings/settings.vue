<template lang="pug">
include /src/mixins.pug

+b.page--cache.container
  +e.H1.title {{ $route.name }}
  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Основные")', name='main')
      tab-main(v-if='tabActive == "main"')
    el-tab-pane(:label='$t("Переводы - Сайт")', name='translations-site')
      tab-translations-site(v-if='tabActive == "translations-site"')
    el-tab-pane(:label='$t("Переводы - Админка")', name='translations-admin')
      tab-translations-site(v-if='tabActive == "translations-admin"')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabMain from './tab-main.vue';

type TabsType = 'main' | 'translations-site' | 'translations-admin';

export default defineComponent({
  name: 'page-settings',

  components: {
    TabMain,
  },
  data() {
    return {
      // Curent active tab
      tabActive: '' as TabsType,
    };
  },

  created() {
    this.setActiveTab();
  },

  methods: {
    // Makes tab active depending on query params url
    setActiveTab() {
      let { tab } = this.$route.query;
      this.tabActive = (tab as TabsType) || 'main';
    },

    // Add query parameters to url when changing tabs
    setTabUrlParam() {
      this.$router.push({ query: { tab: [this.tabActive] } });
    },
  },
});
</script>

<style lang="sass" scoped></style>
