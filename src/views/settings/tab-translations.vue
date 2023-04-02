<template lang="pug">
include /src/mixins.pug

el-form.form-login.u-mb--10(label-position='top', v-loading='isLoading')
  el-button.u-mb--5(type='primary', @click='createTranslitions()') {{ $t('Update list of translations') }}

  el-table(:data='translations', stripe, :scrollbar-always-on='true')
    // #
    el-table-column(label='#', type='index', :index='calcNumberRecord')

    // translitions
    el-table-column(:label='$t("Translitions")')
      template(#default='scope')
        el-link.u-mb--10(type='warning') {{ scope.row.key }}

        el-form-item
          template(v-for='(item, key) in $langs')
            el-input.u-mb--5(
              v-model='scope.row.text[key]',
              style='width: 100%',
              type='text',
              name='translation',
              size='small'
            )
              template(#prepend) {{ key }}

    // save
    el-table-column(:label='$t("Save your changes")', width='200', align='center')
      template(#default='scope')
        el-button(
          type='primary',
          @click='editText({ translationId: scope.row.translationId, text: scope.row.text })'
        ) {{ $t('Save') }}

.u-center
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

import { TranslationTypeNameType, TranslationType, PaginationType } from '@/types';

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
          message: this.$t('Translation edited'),
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
          message: this.$t('Translations updated'),
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
