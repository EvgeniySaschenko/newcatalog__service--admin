<template lang="pug">
include /src/mixins.pug

el-form.form-login.mb-4(label-position='top', v-loading='isLoading')
  el-button.mb-2(type='primary', @click='createTranslitions()') {{ $t('Обновить список переводов') }}

  el-table(:data='translations', stripe, :scrollbar-always-on='true')
    // #
    el-table-column(label='#', type='index', :index='calcNumberRecord')

    // translitions
    el-table-column(:label='$t("Translitions")')
      template(#default='scope')
        el-link.mb-2(type='warning') {{ scope.row.key }}

        el-form-item
          template(v-for='(item, key) in scope.row.text')
            el-input.mb-2(
              v-model='scope.row.text[key]',
              style='width: 100%',
              type='text',
              name='translation'
            )
              template(#prepend) {{ key }}

    // save
    el-table-column(:label='$t("Сохранить изменения")', width='200')
      template(#default='scope')
        el-button(
          type='primary',
          @click='editText({ translationId: scope.row.translationId, text: scope.row.text })'
        ) {{ $t('Сохранить') }}
.justify-content-center.d-flex
  el-pagination(
    :page-size='pagination.maxRecordsPerPage',
    layout='prev, pager, next',
    :total='pagination.itemsCount',
    background,
    @current-change='changePage($event)'
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { TranslationTypeNameType, TranslationType, PaginationType, LangInit } from '@/types';

export default defineComponent({
  props: {
    typeName: {
      type: String as () => TranslationTypeNameType,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      // List translations
      translations: [] as TranslationType[],
      // Pagination
      pagination: {
        page: 1,
        itemsCount: 0,
        maxRecordsPerPage: 0,
        pagesCount: 0,
      } as PaginationType,
      // Langs
      langs: LangInit(),
    };
  },

  async created() {
    await this.init();
  },

  methods: {
    // init
    async init() {
      this.isLoading = true;
      await this.getTranslations();
      this.isLoading = false;
    },

    // Get translations
    async getTranslations() {
      try {
        let { items, itemsCount, maxRecordsPerPage, pagesCount, page } =
          await this.$api.translations.getTranslations({
            typeName: this.typeName,
            page: this.pagination.page,
          });

        this.translations = items;
        this.pagination = {
          page,
          itemsCount,
          maxRecordsPerPage,
          pagesCount,
        };
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      }
    },

    // Update text for translation
    async editText({ translationId, text }: Pick<TranslationType, 'translationId' | 'text'>) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$api.translations.editText({
          translationId,
          text,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Перевод отредатирован'),
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

    // Create translitions for service
    async createTranslitions() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$api.translations.createTranslitions({
          typeName: this.typeName,
        });

        await this.getTranslations();

        this.$utils.showMessageSuccess({
          message: this.$t('Переводы обновлены'),
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

    // Get translations for page
    async changePage(page: number) {
      this.isLoading = true;
      this.pagination.page = page;
      await this.getTranslations();
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
