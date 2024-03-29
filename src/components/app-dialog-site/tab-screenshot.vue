<template lang="pug">
include /src/mixins.pug

// TAB - screenshot
+b.tab-screenshot(v-loading='isLoading')
  // if
  template(v-if='site.isScreenshotProcessCreate')
    el-alert.u-mb--5(
      :title='$t("The website is in queue for taking a screenshot")',
      type='warning',
      show-icon,
      :closable='false'
    )
  // else
  template(v-if='!site.isScreenshotProcessCreate')
    +e.row
      +e.title {{ $t('Screenshot') }}
      +e.content
        +e.col--value
          img(v-if='site.screenshotImg', :src='site.screenshotImg')
          div(v-else)
            el-icon.u-m--10(size='40')
              el-icon-picture
            div {{ $t('There are no screenshots for this website') }}
        +e.col--action
          el-tooltip(
            v-if='!site.screenshotImg && site.isSubdomain',
            :content='$t("Screenshots are not created automatically for subdomains")',
            placement='top'
          )
            el-icon.u-m--10
              el-icon-question-filled
          el-button(type='warning', size='small', @click='createSiteScreenshot()') {{ $t('Take new screenshot') }}

    +e.row
      +e.title {{ $t('Upload screenshot manually') }}
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
              div {{ $t('Select screenshot') }}
        +e.col--action
          el-button(
            type='primary',
            size='small',
            :disabled='!customScreenshotImg',
            @click='uploadCustomSiteScreenshot()'
          ) {{ $t('Save') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RatingItemType } from '@/types';

export default defineComponent({
  inject: ['provideEmitUpdateRatingItem'],
  data() {
    return {
      // Image of selected screenshot
      customScreenshotImg: '',
      // File of selected screenshot
      customScreenshotFile: null as File | null,
      // Mime types
      screenshotMimeTypes: this.$config['images'].screenshotMimeTypes,
      // Loading data
      isLoading: false,
      isShowConfirmNewScreenshot: false,
    };
  },

  props: {
    // Site data
    site: {
      type: Object as () => RatingItemType,
      required: true,
    },
  },

  methods: {
    // Select screenshot on computer
    async selectCustomScreenshot(response: any, uploadFile: any) {
      let mimeType = this.screenshotMimeTypes.includes(uploadFile[0].raw.type);
      if (!mimeType) {
        this.$utils.showMessageError({
          message: this.$t('An invalid file type has been selected'),
        });
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
          message: this.$t('There is already a screenshot for this website. Create new?'),
        });
      }

      this.isLoading = true;

      try {
        let { siteId, url } = this.site;
        await this.$api['sites'].createSiteScreenshot({ siteId, url });

        this.$utils.showMessageSuccess({
          message: `${this.$t('The website has been added to the queue for taking a screenshot')}`,
        });
        (this.provideEmitUpdateRatingItem as any)();
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
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
        await this.$api['sites'].uploadCustomSiteScreenshot({
          siteId,
          screenshotFile: this.customScreenshotFile as File,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Screenshot uploaded')}`,
        });

        (this.$refs['screenshot-upload'] as any).clearFiles();
        (this.provideEmitUpdateRatingItem as any)();
        this.clearCustomScreenshot();
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
