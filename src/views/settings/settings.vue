<template lang="pug">
include /src/mixins.pug

+b.page--settings.container
  +e.H1.title {{ $t($route.name) }}

  .u-mb--10
    el-alert(
      :title='$t(`To see the changes in the "admin", you need to refresh the page`)',
      type='warning',
      show-icon,
      :closable='false'
    )
  .u-mb--10
    el-alert(
      :title='$t(`Changes will be displayed on the "site" after the cache is published`)',
      type='warning',
      show-icon,
      :closable='false'
    )
  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Main Settings")', :name='TabsEnum.main')
      tab-main(v-if='tabActive == TabsEnum.main')

    el-tab-pane(:label='$t("SSL certificates")', :name='TabsEnum.ssl')
      tab-ssl(v-if='tabActive == TabsEnum.ssl')

    el-tab-pane(:label='$t("Languages")', :name='TabsEnum.langs')
      tab-langs(v-if='tabActive == TabsEnum.langs')

    el-tab-pane(:label='`${$t("Translations")} (${ServicesEnum.site.toUpperCase()})`', :name='TabsEnum.tSite')
      tab-translations(
        v-if='tabActive == TabsEnum.tSite',
        :serviceName='ServicesEnum.site',
        :langs='$langs("site")'
      )
    el-tab-pane(:label='`${$t("Translations")} (${ServicesEnum.admin.toUpperCase()})`', :name='TabsEnum.tAdmin')
      tab-translations(
        v-if='tabActive == TabsEnum.tAdmin',
        :serviceName='ServicesEnum.admin',
        :langs='$langs("admin")'
      )
    el-tab-pane(:label='`${$t("Translations")} (${ServicesEnum.api.toUpperCase()})`', :name='TabsEnum.tApi')
      tab-translations(
        v-if='tabActive == TabsEnum.tApi',
        :serviceName='ServicesEnum.api',
        :langs='$langs("admin")'
      )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabMain from './tab-main.vue';
import TabLangs from './tab-langs.vue';
import TabSsl from './tab-ssl.vue';
import TabTranslations from './tab-translations.vue';
import { ServicesEnum } from '@/types';

enum TabsEnum {
  main = 'main',
  ssl = 'ssl',
  langs = 'langs',
  tSite = 'translations-site',
  tAdmin = 'translations-admin',
  tApi = 'translations-api',
}
type TabsType =
  | TabsEnum.main
  | TabsEnum.langs
  | TabsEnum.ssl
  | TabsEnum.tSite
  | TabsEnum.tAdmin
  | TabsEnum.tApi;

export default defineComponent({
  name: 'page-settings',

  components: {
    TabMain,
    TabLangs,
    TabSsl,
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
      this.tabActive = (tab as TabsType) || TabsEnum.main;
    },

    // Add query parameters to url when changing tabs
    setTabUrlParam() {
      this.$router.push({ query: { tab: [this.tabActive] } });
    },
  },
});
</script>

<style lang="sass" scoped></style>
