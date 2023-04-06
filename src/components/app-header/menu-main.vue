<template lang="pug">
include /src/mixins.pug

+b.EL-MENU.menu-main(:default-active='$route.path', mode='horizontal')
  +e.EL-MENU-ITEM.item(:index='item.path', v-for='item in items')
    +e.ROUTER-LINK.link(:to='item.path') {{ item.name }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'menu-main',
  data() {
    return {
      items: [
        { name: this.$t('Ratings list'), path: '/ratings' },
        { name: this.$t('Sections list'), path: '/sections' },
        { name: this.$t('Cache control'), path: '/cache' },
        { name: this.$t('User profile'), path: '/user' },
        { name: this.$t('App Settings'), path: '/settings' },
      ],
    };
  },
});
</script>

<style lang="sass">
.menu-main
  &__item
    padding: 0 !important
  &__link
    height: 100%
    display: block
    padding: 0 20px
</style>
