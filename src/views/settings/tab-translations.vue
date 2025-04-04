<template lang="pug">
include /src/mixins.pug

el-form.form-login.u-mb--10(label-position='top', v-loading='isLoading')
  el-button.u-mb--5(type='primary', @click='createTranslations()') {{ $t('Update list of translations') }}

  el-table(:data='translations', stripe, :scrollbar-always-on='true')
    // #
    el-table-column(label='#', type='index', :index='calcNumberRecord')

    // translations
    el-table-column(:label='$t("Translations")')
      template(#default='scope')
        .u-mb--10
          el-text(type='primary') {{ scope.row.key }}

        el-form-item(:error='errors[`${scope.row.translationId}_text`]')
          template(v-for='(item, key) in langs')
            el-input.u-mb--5(
              v-model='scope.row.text[key]',
              style='width: 100%',
              type='text',
              name='translation',
              size='small'
            )
              template(#prepend) {{ key }}

    // save
    el-table-column(:label='$t("Save")', width='200', align='center')
      template(#default='scope')
        el-button(
          type='primary',
          @click='editText({ translationId: scope.row.translationId, text: scope.row.text })'
        ) {{ $t('Save') }}

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

import { ServicesType, TranslationType, PaginationType, LangType } from '@/types';

export default defineComponent({
  props: {
    // Name service
    serviceName: {
      type: String as () => ServicesType,
      required: true,
    },
    // List langs service
    langs: {
      type: Object as () => LangType,
      required: true,
    },
  },

  data() {
    return {
      isChanges: false,
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
      errors: {} as Record<string, string>,
    };
  },

  async created() {
    await this.init();
  },

  unmounted() {
    // Refresh the page so that the changes are applied to the entire admin panel
    if (this.isChanges) {
      setTimeout(() => {
        location.reload();
      }, 200);
    }
  },

  methods: {
    // init
    async init() {
      this.isLoading = true;
      await this.getTranslationsPartList();
      this.isLoading = false;
    },

    // Get translations
    async getTranslationsPartList() {
      try {
        let { items, itemsCount, maxRecordsPerPage, pagesCount, page } = await this.$api[
          'translations'
        ].getTranslationsPartList({
          serviceName: this.serviceName,
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
        this.$utils.showMessageError({ message: errors.server, errors });
      }
    },

    // Update text for translation
    async editText({ translationId, text }: Pick<TranslationType, 'translationId' | 'text'>) {
      if (this.isLoading) return;
      this.isLoading = true;

      let errorKey = `${translationId}_text`;

      this.$utils.clearErrors(this.errors, { [errorKey]: '' });

      try {
        await this.$api['translations'].editText({
          translationId,
          text,
          serviceName: this.serviceName,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Changed'),
        });

        this.isChanges = true;
      } catch (errors: any) {
        let errorsMsgs = {
          [errorKey]: errors.errors?.text,
        };
        let isValidationError = this.$utils.setErrors(this.errors, errorsMsgs, true);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Create translations for service
    async createTranslations() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$api['translations'].createTranslations({
          serviceName: this.serviceName,
        });

        await this.changePage(1);

        this.$utils.showMessageSuccess({
          message: this.$t('Changed'),
        });

        this.isChanges = true;
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Get translations for page
    async changePage(page: number) {
      this.isLoading = true;
      this.pagination.page = page;
      await this.getTranslationsPartList();
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
