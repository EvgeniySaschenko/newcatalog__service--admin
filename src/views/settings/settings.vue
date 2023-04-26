<template lang="pug">
include /src/mixins.pug

+b.page--settings.container
  +e.H1.title {{ $t($route.name) }}
  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Langs")', :name='TabsEnum.langs')
      tab-langs(v-if='tabActive == TabsEnum.langs')
    el-tab-pane(:label='$t("Translations - Website")', :name='TabsEnum.tSite')
      tab-translations(
        v-if='tabActive == TabsEnum.tSite',
        :serviceName='ServicesEnum.site',
        :langs='$langs("site")'
      )
    el-tab-pane(:label='$t("Translations - Admin panel")', :name='TabsEnum.tAdmin')
      tab-translations(
        v-if='tabActive == TabsEnum.tAdmin',
        :serviceName='ServicesEnum.admin',
        :langs='$langs("admin")'
      )
    el-tab-pane(:label='$t("Translations - API server")', :name='TabsEnum.tApi')
      tab-translations(
        v-if='tabActive == TabsEnum.tApi',
        :serviceName='ServicesEnum.api',
        :langs='$langs("admin")'
      )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabLangs from './tab-langs.vue';
import TabTranslations from './tab-translations.vue';
import { ServicesEnum } from '@/types';

enum TabsEnum {
  langs = 'langs',
  tSite = 'translations-site',
  tAdmin = 'translations-admin',
  tApi = 'translations-api',
}
type TabsType = TabsEnum.langs | TabsEnum.tSite | TabsEnum.tAdmin | TabsEnum.tApi;

export default defineComponent({
  name: 'page-settings',

  components: {
    TabLangs,
    TabTranslations,
  },
  data() {
    return {
      // Curent active tab
      tabActive: '' as TabsType,
      ServicesEnum: ServicesEnum,
      TabsEnum: TabsEnum,
    };
  },

  created() {
    this.setActiveTab();
  },

  methods: {
    // Makes tab active depending on query params url
    setActiveTab() {
      let { tab } = this.$route.query;
      this.tabActive = (tab as TabsType) || TabsEnum.langs;
    },

    // Add query parameters to url when changing tabs
    setTabUrlParam() {
      this.$router.push({ query: { tab: [this.tabActive] } });
    },
  },
});
</script>

<style lang="sass" scoped></style>
