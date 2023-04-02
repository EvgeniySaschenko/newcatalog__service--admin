<template lang="pug">
include /src/mixins.pug

+b.page--cache.container
  +e.H1.title {{ $route.name }}
  el-descriptions(direction='vertical', :column='2', border, v-loading='isLoading')
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
    // Reset cache
    async resetCacheAll() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let response = await this.$api.cache.resetCacheAll();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache created'),
          });
          return;
        }
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Clear cache all
    async clearCacheAll() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let response = await this.$api.cache.clearCacheAll();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache deleted'),
          });
          return;
        }
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Create cache sections
    async createCacheSections() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        await this.$api.cache.createCacheSections();
        this.$utils.showMessageSuccess({
          message: this.$t('Cache created'),
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
