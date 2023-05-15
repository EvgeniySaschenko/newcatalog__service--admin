<template lang="pug">
include /src/mixins.pug

.wrapper(v-loading='isLoading')
  app-header(v-if='isAppRedy', :logoImage='logoImage', :headerInfoHtml='headerInfoHtml')
  router-view(v-if='isAppRedy || isPageLogin')
  footer.container
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SettingsType, SettingsEnum, ServicesEnum } from '@/types';
import AppHeader from '@/components/app-header/app-header.vue';
import useSectionsStore from '@/store/sections';
import { $setLazyLoadOptions } from '@/plugins/lazy-load';
import { inject } from 'vue';
export default defineComponent({
  provide() {
    return {
      provideLogOut: this.logOut,
    };
  },
  data() {
    return {
      // Loading
      isLoading: false,
      // Indicates that the application has received all the required data
      isAppRedy: false,
      // The time of the last action with the page, if the user has been inactive for a long time, he will be logged out
      lastActivityTime: Date.now(),
      // Indicates that the user is logged in
      isUserAuth: false,
      // Logo image
      logoImage: '',
      // header info Html
      headerInfoHtml: '',
    };
  },

  computed: {
    isPageLogin() {
      return (
        this.$route.path == this.$config['pages-specific'].login ||
        location.pathname == this.$config['pages-specific'].login
      );
    },
  },

  components: {
    AppHeader,
  },

  async mounted() {
    await this.init();
  },

  methods: {
    // Get sections
    async init() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        // This request is made to check if the user is logged in.
        await this.refreshAuth();
        // If the user is authorized, he should not get to the login page
        if (this.isUserAuth && this.isPageLogin) {
          window.location.href = this.$config['pages-specific'].default;
        }

        if (!this.isUserAuth) return;
        await this.updateSessionExpiration();
        this.setUserActivityLastTime();
        let sections = await this.$api['sections'].getSections();
        let settings = await this.$api['settings'].getSettings();
        useSectionsStore().setSections(sections);
        let translations = await this.$api['translations'].getTranslationsForFunctionTranslate({
          serviceName: ServicesEnum.admin,
        });

        this.$setTranslations({ translations });
        this.setLangs(settings.settings);

        $setLazyLoadOptions(
          { error: settings.settings[SettingsEnum.imageAppDefault][ServicesEnum.admin] },
          this
        );

        this.logoImage = settings.settings[SettingsEnum.imageAppLogo][ServicesEnum.admin];
        this.headerInfoHtml = settings.settings[SettingsEnum.headerInfoHtml][ServicesEnum.admin];

        this.isAppRedy = true;
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Set langs
    setLangs(settings: SettingsType) {
      // site
      let siteLangs = settings['langs'].site.reduce((a, v) => ({ ...a, [v]: '' }), {});
      this.$setLangs({ langs: siteLangs, serviceName: ServicesEnum.site });
      this.$setLangDefault({
        langDefault: settings['langDefault'].site,
        serviceName: ServicesEnum.site,
      });
      // admin
      let langsAdmin = settings['langs'].admin.reduce((a, v) => ({ ...a, [v]: '' }), {});
      this.$setLangs({ langs: langsAdmin, serviceName: ServicesEnum.admin });
      this.$setLangDefault({
        langDefault: settings['langDefault'].admin,
        serviceName: ServicesEnum.admin,
      });
    },

    // Check session expiration
    async refreshAuth() {
      try {
        await this.$api['users'].refreshAuth();
        this.isUserAuth = true;
        return;
      } catch (errors: any) {
        if (errors.is_not_authorized) return;
        this.$utils.showMessageError({ message: errors.server, errors });
      }
      this.isUserAuth = false;
    },

    // Log out
    async logOut() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        return await this.$api['users'].logOut();
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Update session expiration
    async updateSessionExpiration() {
      if (this.isUserAuth) {
        let refreshTockenTime = this.$config['user'].refreshTockenTime * 1000;
        let idInterval = await setInterval(async () => {
          let userIdleTime = Date.now() - this.lastActivityTime;
          if (userIdleTime > this.$config['user'].idleTime * 1000) {
            await this.logOut();
            clearInterval(idInterval);
          } else {
            await this.refreshAuth();
          }
        }, refreshTockenTime);
      }
    },

    // Set user activity last time
    setUserActivityLastTime() {
      document.addEventListener('touchstart', () => {
        this.lastActivityTime = Date.now();
      });

      document.addEventListener('mousemove', () => {
        this.lastActivityTime = Date.now();
      });
    },
  },
});
</script>

<style lang="sass">
@import "@/assets/style/_style.sass"
</style>
