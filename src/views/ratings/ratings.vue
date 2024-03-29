<template lang="pug">
include /src/mixins.pug
+b.page--ratings.container
  +e.H1.title {{ $t($route.name) }} - {{ $t('Page') }} {{ pagination.page }}

  // Button create new rating
  router-link.inline-block(:to='`${pathPage}/create`')
    el-button(type='primary', icon='el-icon-plus') {{ $t('Create a new rating') }}
  // List ratings
  el-table(:data='ratings', stripe, :scrollbar-always-on='true')
    // #
    el-table-column(label='#', type='index', :index='calcNumberRecord')

    el-table-column(:label='$t("Name")')
      template(#default='scope')
        router-link.u-m--5(:to='`${pathPage}/${scope.row.ratingId}`') {{ scope.row.name[$langDefault('site')] || `#${scope.row.ratingId} - ${$langDefault('site')}` }}
        div
          el-tag.u-m--5(type='warning', effect='plain', v-for='sectionId in scope.row.sectionsIds') {{ sectionsMap[sectionId].name[$langDefault('site')] }}

    el-table-column(:label='$t("Hidden")', width='150')
      template(#default='scope')
        el-tag(v-if='scope.row.isHiden', type='info', effect='dark') {{ $t('Hidden') }}

    el-table-column(:label='$t("Date of first publication")', width='150')
      template(#default='scope')
        .u-text-center
          div {{ $utils.date(scope.row.dateFirstPublication) }}
          el-text(type='info') {{ $utils.time(scope.row.dateFirstPublication) }}

    el-table-column(:label='$t("Cache creation date")', width='150')
      template(#default='scope')
        .u-text-center
          div(v-if='scope.row.dateCacheCreation')
            div {{ $utils.date(scope.row.dateCacheCreation) }}
            el-text(type='info') {{ $utils.time(scope.row.dateCacheCreation) }}
          el-tag.u-mb--5(v-else, type='warning', effect='dark') {{ $t('Not published') }}

  .u-center.u-mt--10
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
    // Sections
    let store = useStoreSections();
    for (let item of store.$state.items) {
      this.sectionsMap[item.sectionId] = item;
    }
    this.getRatings();
  },

  watch: {
    // Added "watch" for "$route" because clicking on the logo does not load a new list
    $route: {
      async handler(current, prev) {
        if (current.path === prev.path) {
          await this.getRatings();
        }
      },
    },
  },

  methods: {
    // Get ratings
    async getRatings() {
      this.isLoading = true;
      let { page } = this.$route.query;
      this.pagination.page = Number(page) || 1;

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
      this.$router.push({ query: { page } });
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.isLoading = false;
    },

    // Reciord number relative all list
    calcNumberRecord(index: number) {
      let { maxRecordsPerPage, page } = this.pagination;
      return (page - 1) * maxRecordsPerPage + (index + 1);
    },
  },
});
</script>

<style lang="sass" scoped></style>
