<template lang="pug">
include /src/mixins.pug

el-form
  el-table(:data='screenshotsErrors', stripe, v-loading='isLoading', :scrollbar-always-on='true')
    el-table-column(label='siteScreenshotId')
      template(#default='scope') {{ scope.row.siteScreenshotId }}
    el-table-column(label='URL', :min-width='150')
      template(#default='scope')
        a(:href='scope.row.url', target='_blank') {{ scope.row.url }}
    el-table-column(:label='$t("Error text")', :min-width='200')
      template(#default='scope')
        div {{ scope.row.errorMessage }}
    el-table-column(:label='$t("Error date")', width='150')
      template(#default='scope') {{ $utils.date(scope.row.dateScreenshotError) }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SiteScreenshotErrorType } from '@/types';

export default defineComponent({
  props: {
    // Rating id
    ratingId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      isLoading: false,
      screenshotsErrors: [] as SiteScreenshotErrorType[],
    };
  },

  async mounted() {
    await this.getSitesSreensErrors();
  },

  methods: {
    // Get sites sreens
    async getSitesSreensErrors() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        this.screenshotsErrors = await this.$api['sites'].getScrenshotsErrors({
          ratingId: this.ratingId,
        });
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
