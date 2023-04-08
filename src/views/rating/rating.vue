<template lang="pug">
include /src/mixins.pug

+b.page--rating.container
  +e.H1.title {{ ratingId ? $t('Edit rating') : $t('Create a new rating') }}
  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Main Settings")', :name='TabsEnum.main')
      tab-main(v-if='tabActive == TabsEnum.main', :ratingId='ratingId')
    el-tab-pane(:label='$t("Content")', :name='TabsEnum.content', :disabled='!ratingId')
      tab-content(v-if='tabActive == TabsEnum.content', :ratingId='ratingId')
    el-tab-pane(:label='$t("Labels")', :name='TabsEnum.labels', :disabled='!ratingId')
      tab-labels(v-if='tabActive == TabsEnum.labels', :ratingId='ratingId')
    el-tab-pane(:label='$t("Create a logo")', :name='TabsEnum.logos', :disabled='!ratingId')
      tab-logos(v-if='tabActive == TabsEnum.logos', :ratingId='ratingId')
    el-tab-pane(
      :label='$t("Screenshots of the error")',
      :name='TabsEnum.screnErrors',
      :disabled='!ratingId'
    )
      tab-screenshots-errors(v-if='tabActive == TabsEnum.screnErrors', :ratingId='ratingId')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabMain from './tab-main.vue';
import TabContent from './tab-content.vue';
import TabLabels from './tab-labels.vue';
import TabLogos from './tab-logos.vue';
import TabScreenshotsErrors from './tab-screenshots-errors.vue';

enum TabsEnum {
  main = 'main',
  content = 'content',
  labels = 'labels',
  logos = 'logos',
  screnErrors = 'screenshots-errors',
}

type TabsType =
  | TabsEnum.main
  | TabsEnum.content
  | TabsEnum.labels
  | TabsEnum.logos
  | TabsEnum.screnErrors;

export default defineComponent({
  name: 'page-rating',

  components: {
    TabMain,
    TabContent,
    TabLabels,
    TabLogos,
    TabScreenshotsErrors,
  },

  mounted() {
    this.setActiveTab();
  },

  data() {
    return {
      // Curent active tab
      tabActive: '' as TabsType,
      TabsEnum: TabsEnum,
    };
  },

  computed: {
    ratingId() {
      let { ratingId } = this.$route.params;
      return ratingId === 'create' ? null : +ratingId;
    },
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
