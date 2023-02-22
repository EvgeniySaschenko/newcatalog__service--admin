<template lang="pug">
include /src/mixins.pug
+b.tab-descr(label-position='top', v-loading='isLoading')
  +e.box-img(:style='{ backgroundColor: state.color }', v-if='isModeEdit')
    +e.IMG.img(:src='state.logoImg', :alt='state.name.ru')
  // Ссылка
  el-form-item(:error='errors.url', :label='$t("Ссылка")', required)
    el-input(
      :placeholder='$t("Ссылка")',
      size='small',
      v-model='state.url',
      :disabled='isModeEdit'
    )
  // Название   
  el-form-item(:error='errors.name', :label='$t("Название ua")')
    el-input(:placeholder='$t("Название")', size='small', v-model='state.name.ua')
  el-form-item(:error='errors.name', :label='$t("Название ru")')
    el-input(:placeholder='$t("Название")', size='small', v-model='state.name.ru')
  // Ярлыки  
  el-form-item
    el-select(
      size='small',
      multiple,
      filterable,
      allow-create,
      :multiple-limit='labelsIdsLimit',
      default-first-option,
      v-model='labelsIds',
      style='width: 100%',
      :placeholder='$t("Ярлыки")'
    )
      el-option(
        v-for='item in labels',
        :key='item.labelId',
        :label='item.name.ru',
        :value='item.labelId'
      )
  // Приоритет  
  el-form-item
    el-input-number(v-model='state.priority', size='small', :placeholder='$t("Приоритет")')
  el-form-item
    el-checkbox(v-model='state.isHiden') {{ $t('Скрыть') }}
  el-form-item
    +e.footer
      el-button(v-if='isModeEdit', type='danger', @click='deleteRatingItem()') {{ $t('Удалить') }}
      el-button(v-if='isModeEdit', type='primary', @click='editRatingItem()') {{ $t('Сохранить') }}
      el-button(v-if='!isModeEdit', type='primary', @click='createRatingItem()') {{ $t('Создать') }}
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType, LangInit, RatingItemType } from '@/types';

export default defineComponent({
  inject: ['provideEmitUpdateRatingItem', 'provideEmitDialogClose'],
  data() {
    return {
      // State rating item
      state: {
        ratingItemId: 0,
        siteId: 0,
        name: LangInit(),
        url: '',
        labelsIds: {},
        ratingId: 0,
        priority: 0,
        siteScreenshotId: 0,
        isHiden: false,
      } as RatingItemType,
      // id labels - needed because the component works with an array, and an object is sent to the server (field "itemCurrent.labelsIds")
      labelsIds: [] as number[],
      // Loading data
      isLoading: false,
      // Error messages
      errors: {
        name: '',
        url: '',
        server: '',
      },
    };
  },

  props: {
    // List labels
    labels: {
      type: Array,
      default: () => [] as LabelType[],
    },

    // Current rating item
    site: {
      type: Object,
      default: () => {},
    },

    // Labels max count
    labelsIdsLimit: {
      type: Number,
    },

    // Element add or edit
    isModeEdit: {
      type: Boolean,
      default: false,
    },

    // Only from add new sites
    ratingId: {
      type: Number,
      default: 0,
    },
  },

  watch: {
    // Сreate new state on change in external source
    site: {
      deep: true,
      immediate: true,
      handler() {
        this.init();
      },
    },
  },

  methods: {
    // Init
    init() {
      if (!this.isModeEdit) return;
      // Is edit
      this.labelsIds = Object.values(this.site.labelsIds);
      this.state = JSON.parse(JSON.stringify({ ...this.site }));
    },

    // Create rating item
    async createRatingItem() {
      if (this.isLoading) return;

      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);
      let labelsIds = this.labelsIds.reduce((a, v) => ({ ...a, [v]: v }), {}) as LabelType[];

      try {
        await this.$api['ratings-items'].createItem({
          ...this.state,
          ratingId: this.ratingId,
          labelsIds,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Добавлен:')}: "${
            this.state.name.ru ? this.state.name.ru : this.$t('Новый сайт')
          }"`,
        });

        (this.provideEmitUpdateRatingItem as any)();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        this.$utils.setErrors(this.errors, errors.errors);
      } finally {
        this.isLoading = false;
      }
    },

    // Edit rating item
    async editRatingItem() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);
      let labelsIds = this.labelsIds.reduce((a, v) => ({ ...a, [v]: v }), {}) as LabelType[];

      try {
        await this.$api['ratings-items'].editItem({
          ...this.state,
          ratingId: this.state.ratingId,
          labelsIds,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Изменён:')}: "${this.state.name.ru}"`,
        });

        (this.provideEmitUpdateRatingItem as any)();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        this.$utils.setErrors(this.errors, errors.errors);
      } finally {
        this.isLoading = false;
      }
    },

    // Delete rating item
    async deleteRatingItem() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        message: this.state.name.ru,
        title: this.$t('Вы действительно хотите удалить?'),
      });
      this.isLoading = true;

      try {
        await this.$api['ratings-items'].deleteItem({ ratingItemId: this.state.ratingItemId });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Удалён:')}: "${this.state.name.ru}"`,
        });

        (this.provideEmitUpdateRatingItem as any)();
        (this.provideEmitDialogClose as any)();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.tab-descr
  &__box-img
    height: 120px
    padding: 10px
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 10px
  &__img
    margin-bottom: 5px
    max-height: 100%
    max-width: 100%
  &__footer
    width: 100%
    text-align: right

.tab-screenshot-logo
  &__row
    margin-bottom: 15px
    border-bottom: 1px solid var(--app-border-color)
    &:last-child
      border-bottom: 0
  &__content
    display: flex
  &__col
    width: 50%
    padding: 10px
    &--value
      text-align: center
    &--action
      display: flex
      justify-content: flex-end
      align-items: center
  &__title
    font-weight: bold
    width: 100%
    font-size: 16px
    margin-bottom: 5px
  &__icon-upload-filled
    width: 36px
    height: 27px
</style>
