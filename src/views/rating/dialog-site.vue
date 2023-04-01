<template lang="pug">
include /src/mixins.pug

// Диалоговое окно для редактирования / создания элемента рейтинга
el-dialog.dialog-rating-item(
  :title='state.ratingItemId ? state.name.ru : $t("Создать элемент")',
  :model-value='true',
  @closed='$emit("dialog:closed")'
)
  el-tabs(v-model='tabActive', type='border-card')
    // TAB - main
    el-tab-pane(:label='$t("Оисание")', name='main')
      +b.tab-main(label-position='top', v-loading='isLoading')
        +e.box-img(:style='{ backgroundColor: state.color }', v-if='!isAddItem')
          +e.IMG.img(:src='state.logoImg', :alt='state.name.ru')
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
            el-button(v-if='!isAddItem', type='danger', @click='deleteRatingItem()') {{ $t('Удалить') }}
            el-button(v-if='!isAddItem', type='primary', @click='editRatingItem()') {{ $t('Сохранить') }}
            el-button(v-if='isAddItem', type='primary', @click='createRatingItem()') {{ $t('Создать') }}

    // TAB - screenshot
    el-tab-pane(:label='$t("Скриншот")', name='screenshot')
      // if
      el-alert.u-mb--5(
        v-if='state.isScreenshotProcessCreate',
        :title='`${$t("Сайт добавлен в очередь для создания скриншота")}`',
        type='warning',
        show-icon,
        :closable='false'
      )
      // else
      +b.tab-screenshot-logo(v-if='!state.isScreenshotProcessCreate')
        +e.row
          +e.title {{ $t('Скриншот') }}
          +e.content
            +e.col--value
              img(v-if='state.screenshotImg', :src='state.screenshotImg')
              div(v-else)
                el-icon.u-m--10(size='40')
                  el-icon-picture
                div {{ $t('Для этого сайта нет скриншотов') }}
            +e.col--action
              el-tooltip(
                v-if='!state.screenshotImg && state.isSubdomain',
                :content='$t("Для субдоменов скриншоты не создаются атоматически")',
                placement='top'
              )
                el-icon.u-m--10
                  el-icon-question-filled
              el-button(type='warning', @click='createSiteScreenshot()', size='small') {{ $t('Сделать новый скриншот') }}

        +e.row
          +e.title {{ $t('Загрузить скриншот вручную') }}
          +e.content
            +e.col--value
              el-upload(
                ref='screenshot-upload',
                :auto-upload='false',
                :limit='1',
                :accept='screenshotMimeTypes.toString()',
                :on-change='selectCustomScreenshot',
                :on-remove='clearCustomScreenshot'
              )
                img(v-if='customScreenshotImg', :src='customScreenshotImg')
                div(v-else)
                  el-icon(size='40')
                    el-icon-upload-filled
                  div {{ $t('Выбрать скриншот') }}
            +e.col--action
              el-button(
                type='primary',
                size='small',
                :disabled='!customScreenshotImg',
                @click='uploadCustomSiteScreenshot()'
              ) {{ $t('Сохранить') }}

    // TAB - logo
    el-tab-pane(:label='$t("Логотип")', name='logo')
      +b.tab-screenshot-logo
        el-alert.u-mb--5(
          v-if='!state.siteScreenshotId',
          :title='`${$t("Необходимо сначала создать скриншот")}`',
          type='warning',
          show-icon,
          :closable='false'
        )
        el-alert.u-mb--5(
          v-if='!state.siteScreenshotId && state.isSubdomain',
          :title='`${$t("Для субдомена можно попробовать найти логотип который используется для домена")}`',
          type='warning',
          show-icon,
          :closable='false'
        )

        // Show if exist screenshot and logo
        +e.row(v-if='state.siteScreenshotId && state.siteLogoId')
          +e.title {{ $t('Логотип') }}
          +e.content
            +e.col--value(:style='{ backgroundColor: state.color }')
              img(:src='state.logoImg')
            +e.col--action
              el-tooltip(:content='$t("На основе текущего скриншота")', placement='top')
                el-icon.u-m--10
                  el-icon-question-filled
              el-button(type='warning', @click='recreateSiteLogo()', size='small') {{ $t('Переделать логотип') }}

        // Show if exist logo
        +e.row(v-if='state.isLogoExist')
          +e.title {{ $t('Цвет') }}
          +e.content
            +e.col--value(:style='{ backgroundColor: state.color }')
              img(:src='state.logoImg')
            +e.col--action
              el-button(type='warning', @click='createScreenshotRatingItem()', size='small') {{ $t('Изменить цвет') }}

        // Show only from subdomain
        +e.row(v-if='state.isSubdomain')
          +e.title {{ $t('Логотипа для домена') }}
          +e.content
            +e.col--value(:style='{ backgroundColor: colorDomain }')
              img(v-if='logoDomainImg', :src='logoDomainImg')
            +e.col--action
              el-tooltip(
                :content='$t("Для субдоменов скриншоты не создаються атоматически, потому что логотипы для домена и субдомена могут быть одинаковыми.")',
                placement='top'
              )
                el-icon.u-m--10
                  el-icon-question-filled
              el-button(type='primary', @click='createScreenshotRatingItem()', size='small') {{ $t('Проверить наличие логотипа') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType, LangInit, RatingItemType } from '@/types';

export default defineComponent({
  emits: ['rating-item:update', 'dialog:closed'],
  // mounted() {
  //   this.init();
  // },
  data() {
    return {
      colorDomain: 'transparent',
      logoImgDomain: '',
      customScreenshotImg: '',
      customScreenshotFile: null as File | null,
      // Mime types
      screenshotMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/json'],
      // Tab current
      tabActive: 'main',
      // Element add / edit
      isAddItem: false,
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

  watch: {
    itemCurrent: {
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
      this.isAddItem = Object.keys(this.itemCurrent)?.length ? false : true;
      if (this.isAddItem) return;
      // Is edit
      this.labelsIds = Object.values(this.itemCurrent.labelsIds);
      this.state = JSON.parse(JSON.stringify({ ...this.itemCurrent }));
    },

    // Select screenshot on computer
    async selectCustomScreenshot(response: any, uploadFile: any) {
      let mimeType = this.screenshotMimeTypes.includes(uploadFile[0].raw.type);
      if (!mimeType) {
        this.$utils.showMessageError({ message: this.$t('Выбран недопустимый тип файла') });
        return;
      }
      this.customScreenshotImg = URL.createObjectURL(uploadFile[0].raw);
      this.customScreenshotFile = uploadFile[0].raw;
    },

    // Clear custom screenshot
    async clearCustomScreenshot() {
      this.customScreenshotImg = '';
      this.customScreenshotFile = null;
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
      await this.$utils.showDialogConfirm({
        title: `${this.$t('Вы действительно хотите удалить?')} "${this.state.name.ru}"`,
      });
      this.isLoading = true;

      try {
        await this.$api['ratings-items'].deleteItem({ ratingItemId: this.state.ratingItemId });

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

    // Create site screenshot
    async createSiteScreenshot() {
      if (this.isLoading) return;
      if (this.state.siteScreenshotId) {
        await this.$utils.showDialogConfirm({
          message: this.$t('Для этого сайта уже существует скриншот, создать новый?'),
        });
      }

      this.isLoading = true;

      try {
        let { siteId, url, ratingItemId } = this.state;
        await this.$api.sites.createSiteScreenshot({ siteId, url });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Сайт добавлен в очередь на создание скриншота')}`,
        });
        this.$emit('rating-item:update', { event: 'update', ratingItemId });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Upload custom screenshot
    async uploadCustomSiteScreenshot() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let { siteId, ratingItemId } = this.state;
        await this.$api.sites.uploadCustomSiteScreenshot({
          siteId,
          screenshotFile: this.customScreenshotFile as File,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Скриншот загружен')}`,
        });
        this.$emit('rating-item:update', { event: 'update', ratingItemId });
        (this.$refs['screenshot-upload'] as any).clearFiles();
        this.clearCustomScreenshot();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Upload custom screenshot
    async recreateSiteLogo() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        let { siteId, ratingItemId } = this.state;
        await this.$api.sites.recreateSiteLogo({
          siteId,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Логотип можно создать на вкладке "Создать логотип"')}`,
        });
        this.$emit('rating-item:update', { event: 'update', ratingItemId });
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
.tab-main
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
