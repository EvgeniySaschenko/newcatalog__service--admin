<template lang="pug">
include /src/mixins.pug

+b.page--cache.container
  +e.H1.title {{ $t($route.name) }}

  .u-mb--10
    el-alert(
      :title='$t("Creating / deleting a cache implies that these changes will be published on the main site")',
      type='info',
      show-icon,
      :closable='false'
    )

  el-descriptions(direction='vertical', :column='2', border, v-loading='isLoading')
    //
    el-descriptions-item {{ $t('Create cache settings') }}
    el-descriptions-item(align='center', width='180')
      el-button(type='primary', @click='createCacheSettings()') {{ $t('Create cache') }}
    //
    el-descriptions-item {{ $t('Create cache for sections') }}
    el-descriptions-item(align='center', width='180')
      el-button(type='primary', @click='createCacheSections()') {{ $t('Create cache') }}
    //
    el-descriptions-item {{ $t('Rebuild all cache') }}
    el-descriptions-item(align='center')
      el-button(type='primary', @click='resetCacheAll()') {{ $t('Create cache') }}
    //
    el-descriptions-item {{ $t('Delete all cache') }}
    el-descriptions-item(align='center')
      el-button(type='danger', @click='clearCacheAll()') {{ $t('Delete cache') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'page-cache',
  data() {
    return {
      // loading data
      isLoading: false,
    };
  },

  methods: {
    // Delete cache all
    async clearCacheAll() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Delete all cache?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].clearCacheAll();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache deleted'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Reset cache
    async resetCacheAll() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Rebuild all cache?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].resetCacheAll();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache created'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Create cache sections
    async createCacheSections() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Create cache for sections?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].createCacheSections();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache created'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Create cache settings
    async createCacheSettings() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Create cache settings site?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].createCacheSettings();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache created'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
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
