<template lang="pug">
include /src/mixins.pug

+b.page--cache.container
  +e.H1.title {{ $route.name }}
  el-descriptions(direction='vertical', :column='2', border, v-loading='isLoading')
    //
    el-descriptions-item {{ $t('Создать кеш разделов') }}
    el-descriptions-item(align='center', width='180')
      el-button(type='primary', @click='createCacheSections()') {{ $t('Создать кеш') }}
    //
    el-descriptions-item {{ $t('Пересоздать кеш для всех элементов') }}
    el-descriptions-item(align='center')
      el-button(type='primary', @click='resetCacheAll()') {{ $t('Создать кеш') }}
    //
    el-descriptions-item {{ $t('Удаляется весь кеш') }}
    el-descriptions-item(align='center')
      el-button(type='danger', @click='clearCacheAll()') {{ $t('Удалить кеш') }}
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
            message: this.$t('Кеш создан'),
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
            message: this.$t('Кеш удалён'),
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
          message: this.$t('Кеш создан'),
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
