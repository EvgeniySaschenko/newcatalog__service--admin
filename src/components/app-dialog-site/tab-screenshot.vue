<template lang="pug">
include /src/mixins.pug

// TAB - screenshot
+b.tab-screenshot(v-loading='isLoading')
  // if
  template(v-if='site.isScreenshotProcessCreate')
    el-alert.mb-2(
      :title='$t("Сайт добавлен в очередь для создания скриншота")',
      type='warning',
      show-icon,
      :closable='false'
    )
  // else
  template(v-if='!site.isScreenshotProcessCreate')
    +e.row
      +e.title {{ $t("Скриншот") }}
      +e.content
        +e.col--value
          img(v-if='site.screenshotImg', :src='site.screenshotImg')
          div(v-else)
            el-icon.m-2(size='40')
              el-icon-picture
            div {{ $t("Для этого сайта нет скриншотов") }}
        +e.col--action
          el-tooltip(
            v-if='!site.screenshotImg && site.isSubdomain',
            :content='$t("Для субдоменов скриншоты не создаются атоматически")',
            placement='top'
          )
            el-icon.m-2
              el-icon-question-filled
          el-button(type='warning', size='small', @click='createSiteScreenshot()') {{ $t("Сделать новый скриншот") }}

    +e.row
      +e.title {{ $t("Загрузить скриншот вручную") }}
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
              div {{ $t("Выбрать скриншот") }}
        +e.col--action
          el-button(
            type='primary',
            size='small',
            :disabled='!customScreenshotImg',
            @click='uploadCustomSiteScreenshot()'
          ) {{ $t("Сохранить") }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inject: ['provideEmitUpdateRatingItem'],
  data() {
    return {
      // Image of selected screenshot
      customScreenshotImg: '',
      // File of selected screenshot
      customScreenshotFile: null as File | null,
      // Mime types
      screenshotMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/json'],
      // Loading data
      isLoading: false,
      isShowConfirmNewScreenshot: false,
    };
  },

  props: {
    // Site data
    site: {
      type: Object,
      required: true,
    },
  },

  methods: {
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

    // Create site screenshot
    async createSiteScreenshot() {
      if (this.isLoading) return;
      if (this.site.siteScreenshotId) {
        await this.$utils.showDialogConfirm({
          title: this.$t('Сделать новый скриншот'),
          message: this.$t('Для этого сайта уже существует скриншот. Cоздать новый?'),
        });
      }

      this.isLoading = true;

      try {
        let { siteId, url } = this.site;
        await this.$api.sites.createSiteScreenshot({ siteId, url });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Сайт добавлен в очередь на создание скриншота')}`,
        });
        (this.provideEmitUpdateRatingItem as any)();
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
        let { siteId } = this.site;
        await this.$api.sites.uploadCustomSiteScreenshot({
          siteId,
          screenshotFile: this.customScreenshotFile as File,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Скриншот загружен')}`,
        });

        (this.$refs['screenshot-upload'] as any).clearFiles();
        (this.provideEmitUpdateRatingItem as any)();
        this.clearCustomScreenshot();
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
.tab-screenshot
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
