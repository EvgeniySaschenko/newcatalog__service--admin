<template lang="pug">
include /src/mixins.pug
+b.HEADER.app-header
  +e.row--info-band(v-if='headerInfoHtml')
    .container(v-html="headerInfoHtml")
  +e.row--top
    .container
      +e.col-1
        +e.ROUTER-LINK.logo(:to='logoUrl')
          +e.IMG.logo-img(:src='logoImage')
      +e.col-2
        language-swich.u-m--5
        el-button.u-m--5(@click='provideLogOut()', type='danger') {{ $t('Exit') }}
  +e.row--menu
    .container
      menu-main
</template>

<script>
import MenuMain from './menu-main.vue';
import LanguageSwich from './language-swich.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  inject: ['provideLogOut'],
  name: 'app-header',
  components: {
    MenuMain,
    LanguageSwich,
  },
  data() {
    return {
      logoUrl: this.$config['pages-specific'].default,
    };
  },

  props: {
    logoImage: {
      type: String,
      required: true,
    },
    headerInfoHtml: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="sass" scoped>
@import "@/assets/style/_variables.sass"
.app-header
  &__logo
    max-width: 270px
    display: inline-flex
    @media (max-width: $app-screen-sm)
      margin-bottom: 10px
    &-img
      width: 100%
  &__row--info-band
    padding: 5px 10px
    text-align: center
    position: relative
    font-size: 14px
    color: #ffffff
    &::after
      content: ""
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      background-color: $app-primary-color
      opacity: .7
      z-index: -1
  &__row--top
    padding: 10px 0
    background-color: $app-primary-color
    .container
      display: flex
      justify-content: space-between
      align-items: center
      @media (max-width: $app-screen-sm)
        flex-direction: column
    .app-header
      &__col-2
        align-items: center
        display: flex
</style>
