<template lang="pug">
include /src/mixins.pug

+b.page--rating.container
  +e.H1.title {{ ratingId ? $t('Edit rating') : $t('Create a new rating') }}
  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Main Settings")', name='main')
      tab-main(v-if='tabActive == "main"', :ratingId='ratingId')
    el-tab-pane(:label='$t("Content")', name='content', :disabled='!ratingId')
      tab-content(v-if='tabActive == "content"', :ratingId='ratingId')
    el-tab-pane(:label='$t("Labels")', name='labels', :disabled='!ratingId')
      tab-labels(v-if='tabActive == "labels"', :ratingId='ratingId')
    el-tab-pane(:label='$t("Create a logo")', name='logos', :disabled='!ratingId')
      tab-logos(v-if='tabActive == "logos"', :ratingId='ratingId')
    el-tab-pane(
      :label='$t("Screenshots of the error")',
      name='screenshots-errors',
      :disabled='!ratingId'
    )
      tab-screenshots-errors(v-if='tabActive == "screenshots-errors"', :ratingId='ratingId')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabMain from './tab-main.vue';
import TabContent from './tab-content.vue';
import TabLabels from './tab-labels.vue';
import TabLogos from './tab-logos.vue';
import TabScreenshotsErrors from './tab-screenshots-errors.vue';

type TabsType = 'main' | 'content' | 'labels' | 'logos' | 'screenshots-errors';

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
