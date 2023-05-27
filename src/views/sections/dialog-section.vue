<template lang="pug">
include /src/mixins.pug

el-dialog(:title='title', :model-value='true', @closed='$emit("dialog:closed")')
  +b.EL-FORM.dialog-section(label-position='top', v-loading='isLoading')
    // Name
    el-form-item(:error='errors.name', :label='$t("Name")')
      +e.item-name(v-for='(item, key) in $langs("site")')
        el-tag.u-mr--10 {{ key }}
        el-input(v-model='section.name[key]')

    // Description
    el-form-item(:error='errors.descr', :label='$t("Description")')
      +e.item-name(v-for='(item, key) in $langs("site")')
        el-tag.u-mr--10 {{ key }}
        el-input(v-model='section.descr[key]', type='textarea', :rows='2')

  el-form-item(:label='$t("Priority")')
    el-input-number(v-model='section.priority', size='small') 
  el-form-item(:label='$t("Hide")')
    el-checkbox(v-model='section.isHiden')
  el-form-item(:error='errors.section')

  template(#footer)
    el-button(v-if='isEdit', type='danger', @click='deleteSection()') {{ $t('Delete') }}
    el-button(v-if='isEdit', type='primary', @click='editSection()') {{ $t('Edit') }}
    el-button(v-if='!isEdit', type='primary', @click='createSection()') {{ $t('Create') }}
</template>

<script lang="ts">
import { SectionType } from '@/types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'dialog-section',
  emits: ['section:update', 'dialog:closed'],
  props: {
    // Section
    sectionCurrent: {
      type: Object as () => SectionType,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      // Errors
      errors: {
        name: '',
        descr: '',
        section: '',
      },
      // Loading data
      isLoading: false,
      // section
      section: {
        name: this.$langs('site'),
        descr: this.$langs('site'),
        sectionId: 0,
        priority: 0,
        isHiden: true,
      } as SectionType,

      title: '',
      isEdit: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    // init
    init() {
      if (this.sectionCurrent.sectionId) {
        this.title = this.$t('Edit a Section');
        this.isEdit = true;
        Object.assign(this.section, JSON.parse(JSON.stringify(this.sectionCurrent)));
      } else {
        this.title = this.$t('Add a Section');
      }
    },

    // Create section
    async createSection() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);

      try {
        await this.$api['sections'].createSection(this.section);
        this.$utils.showMessageSuccess({
          message: this.$t('Added'),
        });
        this.$emit('section:update');
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Edit section
    async editSection() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);

      try {
        await this.$api['sections'].editSection(this.section);
        this.$utils.showMessageSuccess({
          message: this.$t('Changed'),
        });
        this.$emit('section:update');
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Delete section
    async deleteSection() {
      await this.$utils.showDialogConfirm({
        title: this.$t('Are you sure you want to delete?'),
      });
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);

      try {
        await this.$api['sections'].deleteSection({ sectionId: this.section.sectionId });
        this.$utils.showMessageSuccess({
          message: this.$t('Removed'),
        });
        this.$emit('section:update');
        this.$emit('dialog:closed');
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.dialog-section
  &__item-name
    display: flex
    align-items: center
    width: 100%
    margin-bottom: 5px
</style>
