<template lang="pug">
include /src/mixins.pug
+b.page--ratings.container
  +e.H1.title {{ $t($route.name) }}

  // Button create new rating
  router-link.inline-block(:to='`${pathPage}/create`')
    el-button(type='primary', icon='el-icon-plus') {{ $t('Create a new rating') }}
  // List ratings
  el-table(:data='ratings', stripe, :scrollbar-always-on='true')
    el-table-column(:label='$t("Name")')
      template(#default='scope')
        router-link.u-m--5(:to='`${pathPage}/${scope.row.ratingId}`') {{ scope.row.name[$langDefault('site')] || `#${scope.row.ratingId} - ${$langDefault('site')}` }}
        div
          el-tag.u-m--5(type='warning', effect='plain', v-for='sectionId in scope.row.sectionsIds') {{ sectionsMap[sectionId].name[$langDefault('site')] }}
    el-table-column(:label='$t("Date of first publication")', width='150')
      template(#default='scope') {{ $utils.date(scope.row.dateFirstPublication) }}
    el-table-column(:label='$t("Publication date (cached)")', width='150')
      template(#default='scope')
        span(v-if='scope.row.dateCacheCreation') {{ $utils.date(scope.row.dateCacheCreation, 'datetime') }}
        el-tag(v-else, type='info', effect='dark') {{ $t('Not published') }}

  .u-center
    el-pagination(
      v-if='pagination.pagesCount > 1',
      :page-size='pagination.maxRecordsPerPage',
      layout='prev, pager, next',
      :total='pagination.itemsCount',
      background,
      @current-change='changePage($event)',
      v-model:current-page='pagination.page'
    )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useStoreSections from '@/store/sections';
import { SectionType, RatingsListItemType, PaginationType } from '@/types';

export default defineComponent({
  name: 'page-ratings',
  data() {
    return {
      // loading data
      isLoading: false,
      // Path current page
      pathPage: window.location.pathname,
      // List ratings current user
      ratings: [] as RatingsListItemType[],
      // Pagination
      pagination: {
        page: 1,
        itemsCount: 0,
        maxRecordsPerPage: 0,
        pagesCount: 0,
      } as PaginationType,
      // Sections map
      sectionsMap: {} as SectionType[],
    };
  },

  mounted() {
    this.init();
    // Sections
    let store = useStoreSections();
    for (let item of store.$state.items) {
      this.sectionsMap[item.sectionId] = item;
    }
  },

  methods: {
    // Init
    async init() {
      await this.getRatings();
    },

    // Get ratings
    async getRatings() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let { items, page, itemsCount, maxRecordsPerPage, pagesCount } = await this.$api[
          'ratings'
        ].getRatings({ page: this.pagination.page });

        this.ratings = items;
        this.pagination = {
          page,
          itemsCount,
          maxRecordsPerPage,
          pagesCount,
        };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Get ratings for page
    async changePage(page: number) {
      this.pagination.page = page;
      await this.getRatings();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.isLoading = false;
    },
  },
});
</script>

<style lang="sass" scoped></style>
