<template lang="pug">
include /src/mixins.pug

el-form.form-login.u-mb--10(label-position='top', v-loading='isLoading')
  .u-mb--10
    el-alert(
      :title='$t(`To see the changes in the admin panel, you need to refresh the page`)',
      type='warning',
      show-icon,
      :closable='false'
    )

  el-button.u-mb--5(type='primary', @click='createTranslations()') {{ $t('Update list of translations') }}

  el-table(:data='translations', stripe, :scrollbar-always-on='true')
    // #
    el-table-column(label='#', type='index', :index='calcNumberRecord')

    // translations
    el-table-column(:label='$t("Translations")')
      template(#default='scope')
        el-link.u-mb--10(type='warning') {{ scope.row.key }}

        el-form-item
          template(v-for='(item, key) in $langs("site")')
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

import { ServicesType, TranslationType, PaginationType } from '@/types';

export default defineComponent({
  props: {
    serviceTypeName: {
      type: String as () => ServicesType,
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
        let { items, itemsCount, maxRecordsPerPage, pagesCount, page } =
          await this.$api.translations.getTranslationsPartList({
            serviceTypeName: this.serviceTypeName,
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

        this.isChanges = true;
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
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
        await this.$api.translations.createTranslations({
          serviceTypeName: this.serviceTypeName,
        });

        await this.changePage(1);

        this.$utils.showMessageSuccess({
          message: this.$t('Translations updated'),
        });

        this.isChanges = true;
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
