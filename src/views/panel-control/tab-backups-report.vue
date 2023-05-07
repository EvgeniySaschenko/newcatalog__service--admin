<template lang="pug">
include /src/mixins.pug
+b.tab-backups-report
  // List backups
  el-table(:data='backups', stripe, :scrollbar-always-on='true')
    // #
    el-table-column(label='id', width='90')
      template(#default='scope')
        span {{ scope.row.backupId }}

    // Status
    el-table-column(:label='$t("Status")', width='120')
      template(#default='scope')
        el-tag(type='error', v-if='scope.row.isError') {{ $t('Error').toUpperCase() }}
        el-tag(type='warning', v-else-if='!scope.row.report') {{ $t('In progress').toUpperCase() }}
        el-tag(type='success', v-else) {{ $t('Ready').toUpperCase() }}

    // Report
    el-table-column(:label='$t("Report")', align='center')
      template(#default='scope')
        span {{ scope.row.report }}

    // Date create
    el-table-column(:label='$t("Date create")', width='120', align='center')
      template(#default='scope')
        div {{ $utils.date(scope.row.dateCreate) }}
        el-text(size='small') {{ $utils.time(scope.row.dateCreate) }}

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
import { BackupType, PaginationType } from '@/types';

export default defineComponent({
  name: 'page-ratings',
  data() {
    return {
      // loading data
      isLoading: false,
      // backups
      backups: [] as BackupType[],
      // Pagination
      pagination: {
        page: 1,
        itemsCount: 0,
        maxRecordsPerPage: 0,
        pagesCount: 0,
      } as PaginationType,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    // Init
    async init() {
      await this.getBackups();
    },

    // Get backups
    async getBackups() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let backup = await this.$api['backups'].getBackups({ page: this.pagination.page });
        let { items, page, itemsCount, maxRecordsPerPage, pagesCount } = backup;
        this.backups = items;
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

    // Get backups for page
    async changePage(page: number) {
      this.pagination.page = page;
      await this.getBackups();
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
