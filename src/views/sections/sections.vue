<template lang="pug">
include /src/mixins.pug
+b.page--sections.container
  +e.H1.title {{ $route.name }}
  // Add
  el-form(v-loading='isSendingFormAdd')
    el-table(:data='[1]')
      el-table-column
        template(#default='scope')
          el-form-item(:error='errors.formAdd.name', required)
            el-input(v-model='nameNewSection.ua', :placeholder='$t("Название ua")') 
            el-input(v-model='nameNewSection.ru', :placeholder='$t("Название ru")') 

      el-table-column(width='200')
        template(#default='scope')
          el-form-item
            el-button(type='primary', @click='createSection()') {{ $t("Добавить раздел") }}

  // Edit
  el-form
    el-table(
      :data='items',
      stripe,
      row-key='id',
      v-loading='isSendingFormEdit',
      :scrollbar-always-on='true'
    )
      el-table-column(:label='$t("Название")', :min-width='200')
        template(#default='scope')
          el-form-item(:error='errors.formEdit[`${scope.row.id}_name`]', required)
            el-input(v-model='scope.row.name.ua', size='small', :placeholder='$t("Название ua")') 
            el-input(v-model='scope.row.name.ru', size='small', :placeholder='$t("Название ru")') 

      el-table-column(:label='$t("Приоритет")', width='150')
        template(#default='scope')
          el-form-item
            el-input-number(
              v-model='scope.row.priority',
              size='small',
              :placeholder='$t("Приоритет")'
            ) 

      el-table-column(:label='$t("Скрыть")', width='90')
        template(#default='scope')
          el-form-item
            el-checkbox(v-model='scope.row.isHiden')

      el-table-column(:label='$t("Редактировать")', width='150')
        template(#default='scope')
          el-form-item
            el-button(type='primary', size='small', @click='editSection(scope.row)') {{ $t("Редактировать") }}

      el-table-column(:label='$t("Удалить")', width='150')
        template(#default='scope')
          el-form-item
            el-button(
              type='danger',
              size='small',
              @click='deleteSection({ id: scope.row.id, name: scope.row.name })'
            ) {{ $t("Удалить") }}
</template>

<script lang="ts">
import { defineComponent, SetupContext } from 'vue';
import useStoreSections from '@/pinia/sections';
import { SectionType, LangInit } from '@/types';

export default defineComponent({
  name: 'page-sections',
  data() {
    return {
      // Sending form add
      isSendingFormAdd: false,
      // Sending form Edit
      isSendingFormEdit: false,
      // List sections
      items: [] as SectionType[],
      // Name new section
      nameNewSection: LangInit(),
      // Errors messages
      errors: {
        formAdd: {
          name: '',
        },
        formEdit: {} as any,
      },
    };
  },
  watch: {
    sections: {
      deep: true,
      immediate: true,
      handler() {
        this.setState();
      },
    },
  },
  computed: {
    sections() {
      let store = useStoreSections();
      return store.$state.items;
    },
  },
  methods: {
    // Set state sections
    setState() {
      this.items = this.sections.map((el: SectionType) => {
        return { ...el };
      });
    },

    // Get sections
    async getSections() {
      let store = useStoreSections();
      let sections = await this.$api.sections.getSections();
      store.setSections(sections);
      this.$utils.clearErrors(this.errors.formEdit, this.errors.formEdit);
    },

    // Create section
    async createSection() {
      if (this.isSendingFormAdd) return;
      this.isSendingFormAdd = true;
      this.$utils.clearErrors(this.errors.formAdd, this.errors.formAdd);

      try {
        let response = await this.$api.sections.createSection({ name: this.nameNewSection });
        await this.getSections();
        this.$utils.showMessageSuccess({
          message: `${this.$t('Раздел добавлен')}: "${response.name.ru}"`,
        });
        this.nameNewSection = LangInit();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        this.$utils.setErrors(this.errors.formAdd, errors.errors);
      } finally {
        setTimeout(() => {
          this.isSendingFormAdd = false;
        }, 200);
      }
    },

    // Delete section
    async deleteSection({ id, name }: Pick<SectionType, 'id' | 'name'>) {
      await this.$utils.showDialogConfirmDelete({ message: name.ru });
      if (this.isSendingFormEdit) return;
      this.isSendingFormEdit = true;

      try {
        await this.$api.sections.deleteSection(id);
        await this.getSections();
        this.$utils.showMessageSuccess({
          message: `${this.$t('Раздел удалён')}: "${name.ru}"`,
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        setTimeout(() => {
          this.isSendingFormEdit = false;
        }, 200);
      }
    },

    // Edit section
    async editSection(data: SectionType) {
      if (this.isSendingFormEdit) return;
      this.isSendingFormEdit = true;

      let keysErrors = {
        [`${data.id}_name`]: '',
      };
      this.$utils.clearErrors(this.errors.formEdit, keysErrors);

      try {
        await this.$api.sections.editSection(data);
        await this.getSections();
        this.$utils.showMessageSuccess({
          message: `${this.$t('Раздел отредакирован')}: "${data.name.ru}"`,
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        let { name } = errors.errors;
        this.errors.formEdit[`${data.id}_name`] = name;
      } finally {
        setTimeout(() => {
          this.isSendingFormEdit = false;
        }, 200);
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
