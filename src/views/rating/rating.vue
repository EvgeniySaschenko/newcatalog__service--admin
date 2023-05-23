<template lang="pug">
include /src/mixins.pug

+b.page--rating.container
  +e.H1.title {{ $t($route.name) }}<span v-if="ratingName">: "{{ ratingName }}"</span>

  +e.pagination
    +e.pagination-title {{ $t('Go to ratings list') }}:
    +e.pagination-list
      +e.pagination-item(@click='goToPageRatingsList(item)', v-for='item of pagesRatinsList') {{ item }}
  el-tabs(v-model='tabActive', @tab-change='setTabUrlParam()', type='border-card')
    el-tab-pane(:label='$t("Main Settings")', :name='TabsEnum.main')
      tab-main(
        v-if='tabActive == TabsEnum.main',
        :ratingId='ratingId',
        @update:rating='setRatingName()'
      )
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
      isLoading: false,
      ratingName: '',
      pagesRatinsList: [] as number[],
    };
  },

  computed: {
    ratingId() {
      let { ratingId } = this.$route.params;
      return ratingId === 'create' ? null : +ratingId;
    },
  },

  watch: {
    ratingId: {
      immediate: true,
      async handler() {
        await this.setRatingName();
        await this.getRatings();
      },
    },
  },

  methods: {
    // Get data rting (Get ratings
    async getRating(ratingId: number) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        return await this.$api['ratings'].getRating({ ratingId });
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Set rating name (for the header you need to get the name))
    async setRatingName() {
      if (!this.ratingId) return;
      let rating = await this.getRating(this.ratingId);
      if (!rating) return;
      this.ratingName = rating.name[this.$langDefault('site')] as string;
    },

    // Get ratings (for pagination rating list)
    async getRatings() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let { pagesCount } = await this.$api['ratings'].getRatings({ page: 1 });
        for (let i = 0; i < pagesCount; i++) {
          this.pagesRatinsList.push(i + 1);
        }
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    goToPageRatingsList(page: number) {
      this.$router.push({ path: '/ratings', query: { page } });
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },

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

<style lang="sass" scoped>
@import "@/assets/style/_variables.sass"
.page
  &__title span
    font-size: 18px
  &__pagination
    display: flex
    align-items: center
    overflow-y: auto
    margin-bottom: 10px
    white-space: nowrap
    scrollbar-width: 8px
    scrollbar-color: $app-primary-color #fff
    &::-webkit-scrollbar
      height: 8px
      background-color: #fff
    &::-webkit-scrollbar-thumb
      background: $app-primary-color
    &-list
      display: flex
      align-items: center
    &-item
      padding: 3px 5px
      margin: 5px
      color: $app-primary-color
      border: 2px solid $app-primary-color
      min-width: 30px
      display: inline-flex
      align-items: center
      justify-content: center
      cursor: pointer
    &-title
      font-weight: 700
      margin-right: 10px
</style>
