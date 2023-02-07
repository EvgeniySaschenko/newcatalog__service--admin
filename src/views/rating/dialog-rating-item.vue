<template lang="pug">
include /src/mixins.pug

// Диалоговое окно для редактирования / создания элемента рейтинга
el-dialog.dialog-rating-item(
  :title='state.id ? state.name.ru : $t("Создать элемент")',
  :model-value='true',
  @closed='$emit("dialog:closed")'
)
  el-tabs(v-model='tabActive', type='border-card')
    // TAB - descr
    el-tab-pane(:label='$t("Оисание")', name='descr')
      el-form(label-position='top', v-loading='isLoading')
        .dialog-rating-item__box-img(
          :style='{ backgroundColor: state.site.color }',
          v-if='!isAddItem'
        )
          img.dialog-rating-item__img(:src='state.site.img', :alt='state.name.ru')
        // Ссылка
        el-form-item(:error='errors.url', :label='$t("Ссылка")', required)
          el-input(
            :placeholder='$t("Ссылка")',
            size='small',
            v-model='state.url',
            :disabled='!isAddItem'
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
              :key='item.id',
              :label='item.name.ru',
              :value='item.id'
            )
        // Приоритет  
        el-form-item
          el-input-number(v-model='state.priority', size='small', :placeholder='$t("Приоритет")')
        el-form-item
          el-checkbox(v-model='state.isHiden') {{ $t("Скрыть") }}

    // TAB - images
    el-tab-pane(:label='$t("Изображение")', name='images')
      el-form(label-position='top', v-loading='isLoading')
        el-form-item
          el-upload.upload-demo(action='...')
            el-button(type='primary', size='small') {{ $t("Загрузить изображение") }}
        el-form-item
          +e.EL-BUTTON.btn--screenshot(
            type='warning',
            @click='createScreenshotRatingItem()',
            size='small'
          ) {{ $t("Создать скриншот") }}
        el-form-item
          +e.EL-BUTTON.btn--screenshot(
            type='warning',
            @click='createScreenshotRatingItem()',
            size='small'
          ) {{ $t("Вернуть изображение на доработку") }}

  template(#footer)
    el-button(v-if='!isAddItem', type='danger', @click='deleteRatingItem()') {{ $t("Удалить") }}
    el-button(v-if='!isAddItem', type='primary', @click='editRatingItem()') {{ $t("Сохранить") }}
    el-button(v-if='isAddItem', type='primary', @click='createRatingItem()') {{ $t("Создать") }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType, LangInit, RatingItemType } from '@/types';

export default defineComponent({
  emits: ['rating-item:update', 'dialog:closed'],
  mounted() {
    this.init();
  },
  data() {
    return {
      // Tab current
      tabActive: 'descr',
      // Element add / edit
      isAddItem: false,
      // State rating item
      state: {
        id: 0,
        name: LangInit(),
        url: '',
        labelsIds: {},
        ratingId: 0,
        priority: 0,
        site: {},
        isCreatedScreen: false,
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
    // Rating id
    ratingId: {
      type: Number,
      default: 0,
    },

    // List labels
    labels: {
      type: Array,
      default: () => [] as LabelType[],
    },

    // Current rating item
    itemCurrent: {
      type: Object,
      default: () => {},
    },

    // Labels max count
    labelsIdsLimit: {
      type: Number,
    },
  },
  methods: {
    // Init
    init() {
      this.isAddItem = Object.keys(this.itemCurrent)?.length ? false : true;
      if (this.isAddItem) return;
      // Is edit
      this.labelsIds = Object.values(this.itemCurrent.labelsIds);
      this.state = JSON.parse(JSON.stringify({ ...this.itemCurrent }));
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

        this.$emit('rating-item:update', { event: 'create' });
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
          ratingId: this.ratingId,
          labelsIds,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Изменён:')}: "${this.state.name.ru}"`,
        });

        this.$emit('rating-item:update', { event: 'edit' });
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
      await this.$utils.showDialogConfirmDelete({ message: this.state.name.ru });
      this.isLoading = true;

      try {
        await this.$api['ratings-items'].deleteItem({ ratingItemId: this.state.id });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Удалён:')}: "${this.state.name.ru}"`,
        });

        this.$emit('rating-item:update', { event: 'delete' });
        this.$emit('dialog:closed');
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
.dialog-rating-item
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
</style>
