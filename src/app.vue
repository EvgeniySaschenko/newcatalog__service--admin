<template lang="pug">
include /src/mixins.pug

.wrapper(v-loading='isLogOutLoading')
  +b.HEADER.header(v-if='!$user.isPageLogin')
    +e.row--top
      .container
        +e.ROUTER-LINK.logo(to='/ratings')
          +e.IMG.logo-img(src='@/assets/img/logo.png')

        +e.EL-BUTTON.log-out-btn(type='primary', @click='logOut()') {{ $t('Exit') }}
    +e.row--menu
      .container
        app-menu-main
  div(v-loading='isSectionsLoading')
    router-view(v-if='isSectionsRedy || $user.isPageLogin')
  footer.container
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppMenuMain from '@/components/app-menu-main/app-menu-main.vue';
import useSectionsStore from '@/store/sections';
import useSettingsStore from '@/store/settings';

export default defineComponent({
  data() {
    return {
      isSectionsLoading: false,
      isLogOutLoading: false,
      isSectionsRedy: false,
      lastActivityTime: Date.now(),
    };
  },

  components: {
    AppMenuMain,
  },

  async created() {
    if (!this.$user.isPageLogin) {
      // This request is made to check if the user is logged in.
      let isLogin: any = await this.refreshAuth();
      if (isLogin) {
        await this.updateSessionExpiration();
        this.setUserActivityLastTime();
        await this.init();
      }
    }
  },

  methods: {
    // Get sections
    async init() {
      if (this.isSectionsLoading) return;
      this.isSectionsLoading = true;
      try {
        let sections = await this.$api.sections.getSections();
        let settings = await this.$api.settings.getSettings();

        useSectionsStore().setSections(sections);
        useSettingsStore().setSettings(settings);

        this.isSectionsRedy = true;
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isSectionsLoading = false;
      }
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
      if (this.isLogOutLoading) return;
      this.isLogOutLoading = true;
      try {
        return await this.$api.user.logOut();
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLogOutLoading = false;
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

.header
  &__logo
    max-width: 270px
    display: inline-flex
    @media (max-width: $app-screen-sm)
      margin-bottom: 10px
    &-img
      width: 100%
  &__row--top
    padding: 10px 0
    background-color: $app-primary-color
    .container
      display: flex
      justify-content: space-between
      align-items: center
      @media (max-width: $app-screen-sm)
        flex-direction: column
</style>
