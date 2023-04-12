<template lang="pug">
include /src/mixins.pug

+b.EL-FORM.tab-logos(v-loading='isLoading')
  +e.title(ref='title')
    +e.title-col--1
      span {{ $t($route.name) }}&nbsp;
      span(v-if='sreens.length') {{ curIndex + 1 }} {{ $t('from') }} {{ sreens.length }}
    +e.title-col--2
      +e.EL-TAG.tag-processing-status(:type='curItem.isSend ? "success" : ""') {{ curItem.isSend ? $t('Processed') : $t('Not processed') }}
      el-button(
        type='primary',
        @click='createSiteLogo()',
        :disabled='!curItem.color || curItem.isSend'
      ) {{ $t('Save') }}
  +e.row-arrow(v-if='sreens.length')
    +e.EL-ICON-ARROW-LEFT.arrow--prev(@click='setCurrentItem("prev")')
    +e.EL-ICON-ARROW-RIGHT.arrow--next(@click='setCurrentItem("next")')
  +e.row-about
    el-link.text-uppercase(type='primary') {{ curItem.host }}
    el-button(type='primary', icon='el-icon-refresh', size='small', @click='getSitesSreens()') {{ $t('Update list') }}
  app-img-cropper(:img='curItem.screenshotImg', @update:img-data='setImgDataResult($event)')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppImgCropper from '@/components/app-img-cropper/app-img-cropper.vue';
import { SiteLogoScreenshotParamsType, SiteType, SiteScreenshotType } from '@/types';

type LogoDataForCreateType = {
  siteScreenshotId: SiteScreenshotType['siteScreenshotId'];
  screenshotImg: SiteScreenshotType['screenshotImg'];
  color: SiteType['color'];
  params: SiteLogoScreenshotParamsType['logoScreenshotParams'];
  isSend: boolean;
  imgBase64: string;
};

function SiteLogoScreenshotParamsDefault(): LogoDataForCreateType {
  return {
    siteScreenshotId: 0,
    isSend: false,
    color: '',
    screenshotImg: '',
    params: {
      cutHeight: 0,
      cutWidth: 0,
      imgHeight: 0,
      imgWidth: 0,
      left: 0,
      top: 0,
    },
    imgBase64: '',
  };
}

export default defineComponent({
  components: {
    AppImgCropper,
  },
  props: {
    // Rating id
    ratingId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      // Loading data
      isLoading: false,
      // Screenshots where "id" is id screnshot
      sreens: [] as LogoDataForCreateType[],
      // Position current screen in "screens"
      curIndex: 0,
      // Current screen
      curItem: SiteLogoScreenshotParamsDefault(),
      // Errors message
      errors: {
        img: '',
        color: '',
      },
    };
  },

  async mounted() {
    await this.init();
  },

  methods: {
    // Init
    async init() {
      await this.getSitesSreens();
    },

    // Get sites sreens
    async getSitesSreens() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let sreens = await this.$api['sites'].getSitesSreens({ ratingId: this.ratingId });
        this.sreens = sreens.map((el: LogoDataForCreateType) => {
          Object.assign(SiteLogoScreenshotParamsDefault(), el); // add default props
          return el;
        });
        this.setCurrentItem();
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Create site logo
    async createSiteLogo() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);

      try {
        let { siteScreenshotId, color, params } = this.curItem;
        await this.$api['sites'].createSiteLogo({
          siteScreenshotId,
          color,
          logoScreenshotParams: params,
        });

        this.curItem.isSend = true;
        this.sreens[this.curIndex] = this.curItem;

        this.$utils.showMessageSuccess({
          message: `${this.$t('Logo added')}`,
        });
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Set current screenshot
    setCurrentItem(direction?: string) {
      if (!this.sreens.length) return;
      switch (direction) {
        case 'next': {
          let maxIndex = this.sreens.length - 1;
          this.curIndex = this.curIndex + 1 <= maxIndex ? this.curIndex + 1 : maxIndex;
          break;
        }
        case 'prev': {
          this.curIndex = this.curIndex - 1 >= 0 ? this.curIndex - 1 : 0;
          break;
        }
        default:
          this.curIndex = 0;
      }

      this.curItem = JSON.parse(JSON.stringify(this.sreens[this.curIndex]));
    },

    // Set logo params
    setImgDataResult({
      params,
      color,
      imgBase64,
    }: Pick<LogoDataForCreateType, 'params' | 'color' | 'imgBase64'>) {
      if (imgBase64) {
        this.curItem.params = params;
        this.curItem.imgBase64 = imgBase64;
      }
      if (color) {
        this.curItem.color = color;
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.tab-logos
  &__title
    display: flex
    justify-content: space-between
    padding: 10px
  &__row-about,
  &__row-arrow
    display: flex
    justify-content: space-between
    margin-bottom: 10px
  &__arrow
    height: 40px
    cursor: pointer
  &__tag-processing-status
    margin-right: 10px
  &__alert-send-status
    margin-bottom: 10px
</style>
