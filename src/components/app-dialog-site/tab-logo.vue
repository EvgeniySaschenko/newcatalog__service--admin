<template lang="pug">
include /src/mixins.pug

+b.tab-logo(v-loading='isLoading')
  // If not exist screenshot
  .u-mb--5(v-if='!site.siteScreenshotId')
    el-alert(
      :title='$t("You need to take a screenshot first")',
      type='warning',
      show-icon,
      :closable='false'
    )
  // If there is no screenshot and the site is a subdomain
  .u-mb--5(v-if='!site.siteScreenshotId && site.isSubdomain')
    el-alert(
      :title='$t("For a subdomain, you can try to find the logo that is used for the domain")',
      type='warning',
      show-icon,
      :closable='false'
    )
  // If exist screenshot and not exist logo
  .u-mb--5(v-if='site.siteScreenshotId && !site.siteLogoId')
    el-alert(
      :title='$t(`To create a logo, go to the "Create Logo" tab`)',
      type='warning',
      show-icon,
      :closable='false'
    )

  // Logo
  +e.row(v-if='site.siteLogoId')
    +e.title {{ $t('Logo') }}
    +e.content
      +e.col--value
        +e.box-logo-main(:style='{ backgroundColor: site.color }')
          img(:src='site.logoImg')
      +e.col--action
        el-tooltip(:content='$t("Based on current screenshot")', placement='top')
          el-icon.u-m--10
            el-icon-question-filled
        el-button(type='warning', @click='recreateSiteLogo()', size='small') {{ $t('Change the logo') }}

  // Color
  +e.row(v-if='site.siteLogoId')
    +e.title {{ $t('Site color') }}
    +e.content
      +e.col--value
        app-img-color(
          :imgData='{ img: site.logoImg, color: site.color }',
          @update:img-data='newColor = $event.color'
        )
      +e.col--action
        el-button(type='warning', @click='editSitesColor()', size='small') {{ $t('Change color') }}

  // Show only from subdomain
  +e.row(v-if='site.isSubdomain')
    +e.title {{ $t('Logo or screenshot for the domain') }}: {{ site.domain }}
    +e.content
      +e.col--value
        // If not images
        +e.subdomain(v-if='!domain.logoImg && !domain.screenshotImg')
          el-icon.u-m--10(size='40')
            el-icon-picture
        // If exist logo
        +e.subdomain--logo(v-if='domain.logoImg')
          +e.subdomain-title {{ $t('Logo') }}
          +e.subdomain-box-logo(:style='{ backgroundColor: domain.color }')
            img(:src='domain.logoImg')
        // If exist screeshot
        +e.subdomain--screenshot(v-if='domain.screenshotImg')
          +e.subdomain-title {{ $t('Screeshot') }}
          img(:src='domain.screenshotImg')

      +e.col--action
        // Check
        template(v-if='!domain.screenshotImg && !domain.logoImg')
          el-tooltip(
            :content='$t("For subdomains, screenshots are not generated automatically, because the logos for the domain and subdomain can be the same")',
            placement='top'
          )
            el-icon.u-m--10
              el-icon-question-filled
          el-button(type='primary', @click='checkImagesForSite()', size='small') {{ $t('Check for availability') }}
        // If exist screeshot or logo
        template(v-else)
          el-tooltip(
            :content='`${$t("The domain images will be linked to the subdomain")}. ${$t("This means that when you edit the logo/color, the changes will show up wherever this screenshot is used")}`',
            placement='top'
          )
            el-icon.u-m--10
              el-icon-question-filled
          el-button(type='primary', @click='linkDomainImagesToSubdomain()', size='small') {{ $t('Link images to a subdomain') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RatingItemType } from '@/types';
import AppImgColor from '@/components/app-img-color/app-img-color.vue';

export default defineComponent({
  inject: ['provideEmitUpdateRatingItem'],

  mounted() {
    this.newColor = this.site.color;
  },

  data() {
    return {
      domain: {
        siteId: 0,
        logoImg: '',
        screenshotImg: '',
        color: '',
      },
      newColor: '',
      isLoading: false,
    };
  },

  components: {
    AppImgColor,
  },

  props: {
    // Site
    site: {
      type: Object as () => RatingItemType,
      required: true,
    },
  },

  methods: {
    // Upload custom screenshot
    async recreateSiteLogo() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        let { siteId } = this.site;
        await this.$api['sites'].recreateSiteLogo({
          siteId,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('A logo can be created on the "Create a logo" tab'),
        });
        (this.provideEmitUpdateRatingItem as any)();
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Check for a logo or screenshot for a host
    async checkImagesForSite() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        let { domain } = this.site;
        let { isNotExistImages, isScreenshotProcessCreate, siteId, logoImg, screenshotImg, color } =
          await this.$api['sites'].checkImagesForSite({
            host: domain,
          });

        if (isNotExistImages) {
          await this.$utils.showDialogAlert({
            title: `${this.$t('Domain')}: ${domain}`,
            message: this.$t('There are no logos or screenshots for this domain'),
          });
          return;
        }

        if (isScreenshotProcessCreate) {
          await this.$utils.showDialogAlert({
            title: `${this.$t('Check')}: ${domain}`,
            message: this.$t('A screenshot for this domain is in the process of being created'),
          });
          return;
        }

        this.domain = {
          siteId,
          logoImg,
          screenshotImg,
          color,
        } as {
          siteId: number;
          logoImg: string;
          screenshotImg: string;
          color: string;
        };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Link domain images to subdomain
    async linkDomainImagesToSubdomain() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        let result = await this.$api['sites'].getSiteBySiteId({
          siteId: this.site.siteId,
        });
        if (result && result.siteScreenshotId) {
          let text = this.$t('There is already another image associated with the domain');
          await this.$utils.showDialogConfirm({
            message: `${text} ${this.$t('Link this image?')}`,
          });
        }

        await this.$api['sites'].linkDomainImagesToSubdomain({
          domainSiteId: this.domain.siteId,
          subdomainSiteId: this.site.siteId,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Domain images are tied to a subdomain'),
        });

        this.domain = {
          siteId: 0,
          logoImg: '',
          screenshotImg: '',
          color: '',
        };

        (this.provideEmitUpdateRatingItem as any)();
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Update sites color
    async editSitesColor() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$api['sites'].editSitesColor({
          siteScreenshotId: this.site.siteScreenshotId,
          color: this.newColor,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Site color updated'),
        });

        (this.provideEmitUpdateRatingItem as any)();
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
.tab-logo
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
  &__box-logo-main
    padding: 20px
  &__subdomain
    margin-bottom: 10px
    &-title
      margin-bottom: 10px
      font-size: 14px
      font-weight: bold
      text-align: left
      color: var(--app-primary-color)
    &-box-logo
      padding: 10px
</style>
