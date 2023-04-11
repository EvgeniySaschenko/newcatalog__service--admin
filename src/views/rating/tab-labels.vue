<template lang="pug">
include /src/mixins.pug

// Add Label
dialog-label(
  v-if='isShowDialogAdd',
  actionType='create',
  :ratingId='ratingId',
  :title='$t("Add Label")',
  @dialog:closed='toggleDialogLabelAdd(false)',
  @label:update='getLabels(ratingId)'
)
el-button(type='primary')(@click='toggleDialogLabelAdd(true)') {{ $t('Add Label') }}

// Edit Label
dialog-label(
  v-if='isShowDialogEdit',
  actionType='edit',
  :color='labelCurrent.color',
  :name='labelCurrent.name',
  :labelId='labelCurrent.labelId',
  :ratingId='ratingId',
  :title='$t("Edit Label")',
  @dialog:closed='toggleDialogLabelEdit(false, {})',
  @label:update='getLabels(ratingId)'
)

// Shortcut List
el-table(:data='labels')
  el-table-column(:label='$t("Label")')
    template(#default='scope')
      div(v-for='(value, key) in $langs("site")')
        el-tag.u-mr--10 {{ key }}
        .label-rating(:style='{ backgroundColor: scope.row.color }') {{ scope.row.name[key] }}
  el-table-column(:label='$t("Edit")', fixed='right', width='180')
    template(#default='scope')
      el-button(type='primary', @click='toggleDialogLabelEdit(true, { ...scope.row })') {{ $t('Edit') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType } from '@/types';
import DialogLabel from './dialog-label.vue';

export default defineComponent({
  props: {
    // Rating id
    ratingId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      // Show dialog for add label
      isShowDialogAdd: false,
      // Show dialog for edit label
      isShowDialogEdit: false,
      // Текущий ярлык
      labelCurrent: {} as LabelType | object,
      // Loading data
      isLoading: false,
      // List rating labels
      labels: [] as LabelType[],
    };
  },
  components: {
    DialogLabel,
  },
  mounted() {
    this.init();
  },
  methods: {
    // Init
    async init() {
      if (this.ratingId) {
        await this.getLabels(this.ratingId);
      }
    },

    // Get data labels
    async getLabels(ratingId: number) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.labels = await this.$api['labels'].getLabels({ ratingId });
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Toggle dialog for label add
    toggleDialogLabelAdd(isShow: boolean) {
      this.isShowDialogAdd = isShow;
    },

    // Toggle dialog for label edit
    toggleDialogLabelEdit(isShow: boolean, label: LabelType | object) {
      this.isShowDialogEdit = isShow;
      this.labelCurrent = label;
    },
  },
});
</script>

<style lang="sass" scoped></style>
