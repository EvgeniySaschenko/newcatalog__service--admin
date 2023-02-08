<template lang="pug">
include /src/mixins.pug

// Добавить ярлык
dialog-label-rating(
  v-if='isShowDialogAdd',
  actionType='create',
  :ratingId='ratingId',
  :title='$t("Добавить ярлык")',
  @dialog:closed='toggleDialogLabelAdd(false)',
  @label:update='getLabels(ratingId)'
)
el-button(type='primary')(@click='toggleDialogLabelAdd(true)') {{ $t("Добавить ярлык") }}

// Редактировать ярлык
dialog-label-rating(
  v-if='isShowDialogEdit',
  actionType='edit',
  :color='labelCurrent.color',
  :name='labelCurrent.name',
  :labelId='labelCurrent.labelId',
  :ratingId='ratingId',
  :title='$t("Редактировать ярлык")',
  @dialog:closed='toggleDialogLabelEdit(false, {})',
  @label:update='getLabels(ratingId)'
)

// Список ярлыков
el-table(:data='labels')
  el-table-column(:label='$t("Ярлык")')
    template(#default='scope')
      .label-rating(:style='{ backgroundColor: scope.row.color }') {{ scope.row.name.ua }}
      .label-rating(:style='{ backgroundColor: scope.row.color }') {{ scope.row.name.ru }}
  el-table-column(:label='$t("Редактировать")', fixed='right', width='180')
    template(#default='scope')
      el-button(
        type='primary',
        @click='toggleDialogLabelEdit(true, { ...scope.row })',
        size='small'
      ) {{ $t("Редактировать") }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType } from '@/types';
import DialogLabelRating from './dialog-label-rating.vue';

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
    DialogLabelRating,
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
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
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
