<template lang="pug">
include /src/mixins.pug

.wrapper(v-loading='isLoading')
  app-header(v-if='isInitRedy')
  router-view(v-if='isInitRedy || $user.isPageLogin')
  footer.container
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SettingsEnum, SettingsType, ServicesShortEnum, ServicesEnum } from '@/types';
import AppHeader from '@/components/app-header/app-header.vue';
import useSectionsStore from '@/store/sections';
import useSettingsStore from '@/store/settings';

export default defineComponent({
  provide() {
    return {
      provideLogOut: this.logOut,
    };
  },
  data() {
    return {
      isLoading: false,
      isInitRedy: false,
      lastActivityTime: Date.now(),
    };
  },

  components: {
    AppHeader,
  },

  async created() {
    await this.init();
  },

  methods: {
    // Get sections
    async init() {
      if (this.$user.isPageLogin) return;
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        // This request is made to check if the user is logged in.
        let isLogin: any = await this.refreshAuth();
        if (!isLogin) return;
        await this.updateSessionExpiration();
        this.setUserActivityLastTime();
        let sections = await this.$api.sections.getSections();
        let settings = await this.$api.settings.getSettings();

        useSectionsStore().setSections(sections);
        useSettingsStore().setSettings(settings);
        let translations = await this.$api.translations.getTranslationsForFunctionTranslate({
          serviceTypeName: ServicesEnum.admin,
        });

        this.$setTranslationsList({ translations });
        this.setLangsApp(settings.settings);
        this.isInitRedy = true;
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Set langs
    setLangsApp(settings: SettingsType) {
      // site
      let siteLangs = settings[SettingsEnum.siteLangs].reduce((a, v) => ({ ...a, [v]: '' }), {});
      this.$setLangs({ langs: siteLangs, type: ServicesShortEnum.site });
      this.$setLangDefault({ lang: settings[SettingsEnum.siteLang], type: ServicesShortEnum.site });
      // admin
      let adminLangs = settings[SettingsEnum.adminLangs].reduce((a, v) => ({ ...a, [v]: '' }), {});
      this.$setLangs({ langs: adminLangs, type: ServicesShortEnum.admin });
      this.$setLangDefaultLocalAdmin({ lang: settings[SettingsEnum.adminLang] });
    },

    // Check session expiration
    async refreshAuth() {
      try {
        return await this.$api.user.refreshAuth();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      }
    },

    // Log out
    async logOut() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        return await this.$api.user.logOut();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Update session expiration
    async updateSessionExpiration() {
      if (!this.$user.isPageLogin) {
        let refreshTockenTime = this.$user.refreshTockenTime * 1000;

        let idInterval = await setInterval(async () => {
          let userIdleTime = (Date.now() - this.lastActivityTime) / 1000;

          if (userIdleTime > this.$user.userIdleTime * 1000) {
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
