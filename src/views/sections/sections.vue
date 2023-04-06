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
            el-input.u-mb--5(
              v-model='nameNewSection[key]',
              :placeholder='$t("Name")',
              v-for='(item, key) in $langs("site")'
            )
              template(#prepend) {{ key }}

      el-table-column(width='200')
        template(#default='scope')
          el-form-item
            el-button(type='primary', @click='createSection()') {{ $t('Add Section') }}

  // Edit
  el-form
    el-table(:data='items', stripe, v-loading='isSendingFormEdit', :scrollbar-always-on='true')
      el-table-column(:label='$t("Name")', :min-width='200')
        template(#default='scope')
          el-form-item(:error='errors.formEdit[`${scope.row.sectionId}_name`]', required)
            el-input.u-mb--5(
              v-model='scope.row.name[key]',
              size='small',
              :placeholder='$t("Name")',
              v-for='(item, key) in $langs("site")'
            )
              template(#prepend) {{ key }}

      el-table-column(:label='$t("Priority")', width='150')
        template(#default='scope')
          el-form-item
            el-input-number(
              v-model='scope.row.priority',
              size='small',
              :placeholder='$t("Priority")'
            ) 

      el-table-column(:label='$t("Hide")', width='90')
        template(#default='scope')
          el-form-item
            el-checkbox(v-model='scope.row.isHiden')

      el-table-column(:label='$t("Edit")', width='150')
        template(#default='scope')
          el-form-item
            el-button(type='primary', @click='editSection(scope.row)') {{ $t('Edit') }}

      el-table-column(:label='$t("Delete")', width='150')
        template(#default='scope')
          el-form-item
            el-button(type='danger', @click='deleteSection({ sectionId: scope.row.sectionId })') {{ $t('Delete') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useStoreSections from '@/store/sections';
import { SectionType } from '@/types';

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
      nameNewSection: this.$langs('site'),
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
        await this.$api.sections.createSection({
          name: this.nameNewSection,
        });
        await this.getSections();
        this.nameNewSection = this.$langs('site');
        this.$utils.showMessageSuccess({
          message: this.$t('Section added'),
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        this.$utils.setErrors(this.errors.formAdd, errors.errors);
      } finally {
        this.isSendingFormAdd = false;
      }
    },

    // Delete section
    async deleteSection({ sectionId }: Pick<SectionType, 'sectionId'>) {
      await this.$utils.showDialogConfirm({
        title: this.$t('Are you sure you want to delete?'),
      });
      if (this.isSendingFormEdit) return;
      this.isSendingFormEdit = true;

      try {
        await this.$api.sections.deleteSection({ sectionId: +sectionId });
        await this.getSections();
        this.$utils.showMessageSuccess({
          message: this.$t('Section deleted'),
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        if (errors.errors.section) {
          this.$utils.showMessageError({ message: errors.errors.section });
        }
      } finally {
        this.isSendingFormEdit = false;
      }
    },

    // Edit section
    async editSection(section: SectionType) {
      if (this.isSendingFormEdit) return;
      this.isSendingFormEdit = true;

      let keysErrors = {
        [`${section.sectionId}_name`]: '',
      };
      this.$utils.clearErrors(this.errors.formEdit, keysErrors);

      try {
        await this.$api.sections.editSection(section);
        await this.getSections();
        this.$utils.showMessageSuccess({
          message: this.$t('Section edited'),
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        let { name } = errors.errors;
        this.errors.formEdit[`${section.sectionId}_name`] = name;
      } finally {
        this.isSendingFormEdit = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
