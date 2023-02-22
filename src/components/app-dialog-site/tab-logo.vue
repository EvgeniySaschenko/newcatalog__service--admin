<template lang="pug">
include /src/mixins.pug

+b.tab-logo(v-loading='isLoading')
  // If not exist screenshot
  el-alert.mb-2(
    v-if='!site.siteScreenshotId',
    :title='$t("Необходимо сначала создать скриншот")',
    type='warning',
    show-icon,
    :closable='false'
  )
  // If there is no screenshot and the site is a subdomain
  el-alert.mb-2(
    v-if='!site.siteScreenshotId && site.isSubdomain',
    :title='$t("Для субдомена можно попробовать найти логотип который используется для домена")',
    type='warning',
    show-icon,
    :closable='false'
  )
  // If exist screenshot and not exist logo
  el-alert.mb-2(
    v-if='site.siteScreenshotId && !site.siteLogoId',
    :title='$t(`Для создания логотипа, перейдите на вкладку "Создать логотип"`)',
    type='warning',
    show-icon,
    :closable='false'
  )

  // Logo
  +e.row(v-if='site.siteLogoId')
    +e.title {{ $t('Логотип') }}
    +e.content
      +e.col--value
        +e.box-logo-main(:style='{ backgroundColor: site.color }')
          img(:src='site.logoImg')
      +e.col--action
        el-tooltip(:content='$t("На основе текущего скриншота")', placement='top')
          el-icon.m-2
            el-icon-question-filled
        el-button(type='warning', @click='recreateSiteLogo()', size='small') {{ $t('Внести измения в логотип') }}

  // Color
  +e.row(v-if='site.siteLogoId')
    +e.title {{ $t('Цвет сайта') }}
    +e.content
      +e.col--value
        app-img-color(
          :imgData='{ img: site.logoImg, color: site.color }',
          @update:img-data='newColor = $event.color'
        )
      +e.col--action
        el-button(type='warning', @click='editSitesColor()', size='small') {{ $t('Изменить цвет') }}

  // Show only from subdomain
  +e.row(v-if='site.isSubdomain')
    +e.title {{ $t('Логотип или скриншот для домена') }}: {{ site.domain }}
    +e.content
      +e.col--value
        // If not images
        +e.subdomain(v-if='!domain.logoImg && !domain.screenshotImg')
          el-icon.m-2(size='40')
            el-icon-picture
        // If exist logo
        +e.subdomain--logo(v-if='domain.logoImg')
          +e.subdomain-title {{ $t('Логотип') }}
          +e.subdomain-box-logo(:style='{ backgroundColor: domain.color }')
            img(:src='domain.logoImg')
        // If exist screeshot
        +e.subdomain--screenshot(v-if='domain.screenshotImg')
          +e.subdomain-title {{ $t('Скриншот') }}
          img(:src='domain.screenshotImg')

      +e.col--action
        // Check
        template(v-if='!domain.screenshotImg && !domain.logoImg')
          el-tooltip(
            :content='$t("Для субдоменов скриншоты не создаються атоматически, потому что логотипы для домена и субдомена могут быть одинаковыми")',
            placement='top'
          )
            el-icon.m-2
              el-icon-question-filled
          el-button(type='primary', @click='checkImagesForSite()', size='small') {{ $t('Проверить наличие') }}
        // If exist screeshot or logo
        template(v-else)
          el-tooltip(
            :content='`${$t("Изображения домена")} "${site.domain}" ${$t("будут привязаны к субдомену")} "${site.hostname}". ${$t("Это означает что при редактировании логотипа / цвета изменения отбразятся везде где используется этот скриншот")}`',
            placement='top'
          )
            el-icon.m-2
              el-icon-question-filled
          el-button(type='primary', @click='linkDomainImagesToSubdomain()', size='small') {{ $t('Привязать изображения к субдомену') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
      type: Object,
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
        await this.$api.sites.recreateSiteLogo({
          siteId,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Логотип можно создать на вкладке "Создать логотип"'),
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

    // Check for a logo or screenshot for a host
    async checkImagesForSite() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        let { domain } = this.site;
        let { isNotExistImages, isScreenshotProcessCreate, siteId, logoImg, screenshotImg, color } =
          await this.$api.sites.checkImagesForSite({
            host: domain,
          });

        if (isNotExistImages) {
          await this.$utils.showDialogAlert({
            title: `${this.$t('Домен')}: ${domain}`,
            message: this.$t('Для этого домена нет логотипов или скриншотов'),
          });
          return;
        }

        if (isScreenshotProcessCreate) {
          await this.$utils.showDialogAlert({
            title: `${this.$t('Проверка')}: ${domain}`,
            message: this.$t('Скриншот для этого домена находися в процессе создания'),
          });
          return;
        }

        this.domain = {
          siteId,
          logoImg,
          screenshotImg,
          color,
        };
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Link domain images to subdomain
    async linkDomainImagesToSubdomain() {
      if (this.isLoading) return;
      this.isLoading = true;
      console.log(this.site);
      try {
        let result = await this.$api.sites.getSiteBySiteId({ siteId: this.site.siteId });
        if (result && result.siteScreenshotId) {
          await this.$utils.showDialogConfirm({
            message: `${this.$t('К домену')} "${this.site.hostname}" 
            ${this.$t('уже привязано другое изображение')} 
            ${this.$t('Привязать это изображение?')}`,
          });
        }

        await this.$api.sites.linkDomainImagesToSubdomain({
          domainSiteId: this.domain.siteId,
          subdomainSiteId: this.site.siteId,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Изображения домена привязаны к субдомену'),
        });

        this.domain = {
          siteId: 0,
          logoImg: '',
          screenshotImg: '',
          color: '',
        };

        (this.provideEmitUpdateRatingItem as any)();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Update sites color
    async editSitesColor() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$api.sites.editSitesColor({
          siteScreenshotId: this.site.siteScreenshotId,
          color: this.newColor,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Цвет сайта обновлён'),
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
