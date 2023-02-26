<template lang="pug">
include /src/mixins.pug

+b.page--cache.container
  +e.H1.title {{ $route.name }}
  el-descriptions(direction='vertical', :column='2', border, v-loading='isLoading')
    //
    el-descriptions-item(:label='$t("Описание")') {{ $t('Создаётся кеш только для изменённых элементов') }}
    el-descriptions-item(:label='$t("Действие")')
      el-button(type='primary', @click='createCache()') {{ $t('Создать кеш') }}
    //
    el-descriptions-item {{ $t('Создаётся новый кеш для всех элементов') }}
    el-descriptions-item
      el-button(type='primary', @click='resetCache()') {{ $t('Сбросить кеш') }}
    //
    el-descriptions-item {{ $t('Удаляется весь кеш') }}
    el-descriptions-item
      el-button(type='primary', @click='clearCacheAll()') {{ $t('Удалить кеш') }}
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
    // Create cache
    async createCache() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let response = await this.$api.cache.createCache();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Кеш создан'),
          });
          return;
        }
        this.$utils.showMessageError({
          message: this.$t('При создании кеша возникли ошибки. Возможно он создан частично.'),
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

    // Reset cache
    async resetCache() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let response = await this.$api.cache.resetCache();

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
  },
});
</script>

<style lang="sass" scoped></style>
