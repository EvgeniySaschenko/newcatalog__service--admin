<template lang="pug">
include /src/mixins.pug

+b.page--panel-control.container
  +e.H1.title {{ $t($route.name) }}

  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Main Settings")', :name='TabsEnum.main')
      tab-main(v-if='tabActive == TabsEnum.main')
    el-tab-pane(:label='$t("Backups report")', :name='TabsEnum.backupsReport')
      tab-backups-report(v-if='tabActive == TabsEnum.backupsReport')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabMain from './tab-main.vue';
import TabBackupsReport from './tab-backups-report.vue';

enum TabsEnum {
  main = 'main',
  backupsReport = 'backupsReport',
}
type TabsType = TabsEnum.main | TabsEnum.backupsReport;

export default defineComponent({
  name: 'page-panel-control',
  data() {
    return {
      // Curent active tab
      tabActive: '' as TabsType,
      TabsEnum,
    };
  },

  components: {
    TabMain,
    TabBackupsReport,
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
