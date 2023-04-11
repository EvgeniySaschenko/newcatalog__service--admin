<template lang="pug">
include /src/mixins.pug

el-dialog(:title='title', :model-value='true', @closed='$emit("dialog:closed")')
  +b.EL-FORM.dialog-label-rating(label-position='top', v-loading='isLoading')
    // text
    el-form-item(:error='errors.name', :label='$t("Name")')
      el-input.u-mb--5(
        :placeholder='$t("Label text")',
        v-model='label.name[key]',
        required,
        v-for='(item, key) in $langs("site")'
      )
        template(#prepend) {{ key }}
    // bcolor
    el-form-item(:error='errors.color', :label='$t("Label color")')
      +e.colors
        +e.colors-item(
          v-for='item in colorsDefault',
          :style='{ backgroundColor: item, borderColor: label.color == item ? label.color : "#fff" }',
          :key='item',
          @click='setColor(item)'
        )
        el-color-picker(v-model='label.color')
    el-form-item(:label='$t("Label")')
      .label-rating(:style='{ backgroundColor: label.color }') {{ label.name[$langDefault('site')] }}

  template(#footer)
    el-button(v-if='actionType == "edit"', type='danger', @click='deleteLabel()') {{ $t('Delete') }}
    el-button(v-if='actionType == "edit"', type='primary', @click='editLabel()') {{ $t('Edit') }}
    el-button(v-if='actionType == "create"', type='primary', @click='createLabel()') {{ $t('Create') }}
</template>

<script lang="ts">
import { $langs } from '@/plugins/translations';
import { LangType } from '@/types';
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['label:update', 'dialog:closed'],
  props: {
    // Label name
    name: {
      type: Object,
      default: () => {
        return $langs('site');
      },
    },
    // Label color
    color: {
      type: String,
      default: '#7952b3',
    },
    // Title dialog
    title: {
      type: String,
      default: '',
    },
    // Label id from delete / edit
    labelId: {
      type: Number,
      default: null,
    },
    // Rating id
    ratingId: {
      type: Number,
      default: null,
    },
    // Action type for back-end query
    actionType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // Errors
      errors: {
        name: '',
        color: '',
      },
      // Loading data
      isLoading: false,
      // Rating label
      label: {
        name: this.$langs('site'),
        color: '',
      },
      // Default colors
      colorsDefault: [
        '#7952b3',
        '#E94B3C',
        '#409EFF',
        '#67C23A',
        '#E6A23C',
        '#F56C6C',
        '#909399',
        '#e91e63',
        '#9c27b0',
        '#009688',
        '#357a38',
        '#4780ad',
        '#4615b2',
        '#00FF00',
        '#000000',
        '#ff9100',
        '#003C7A',
      ],
    };
  },
  created() {
    this.label.name = { ...(this.name as LangType) };
    this.label.color = this.color;
  },
  methods: {
    // Set color
    setColor(color: string) {
      this.label.color = color;
    },

    // Create rating label
    async createLabel() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);

      try {
        await this.$api['labels'].createLabel({
          color: this.label.color,
          name: this.label.name,
          ratingId: this.ratingId,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Label created'),
        });

        this.$emit('label:update', { event: 'create' });
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Edit rating label
    async editLabel() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);

      try {
        await this.$api['labels'].editLabel({
          labelId: this.labelId,
          color: this.label.color,
          name: this.label.name,
          ratingId: this.ratingId,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Label changed'),
        });

        this.$emit('label:update', { event: 'edit' });
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Delete label
    async deleteLabel() {
      await this.$utils.showDialogConfirm({
        title: this.$t('Are you sure you want to delete?'),
      });
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        await this.$api['labels'].deleteLabel({
          labelId: this.labelId,
          ratingId: this.ratingId,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Label removed'),
        });

        this.$emit('label:update', { event: 'delete' });
        this.$emit('dialog:closed');
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.dialog-label-rating
  &__colors
    display: inline-flex
    align-items: center
    flex-wrap: wrap
    &-item
      border: 4px solid #fff
      height: 30px
      width: 30px
      margin: 2px
      cursor: pointer
</style>
