<template lang="pug">
include /src/mixins.pug

+b.EL-MENU.menu-main(:default-active='$route.path', mode='horizontal')
  +e.EL-MENU-ITEM.item(:index='item.path', v-for='item in items')
    +e.ROUTER-LINK.link(:to='item.path') {{ item.name }}
</template>

<script lang="ts">
export default {
  name: 'menu-main',
  data() {
    return {
      items: [
        { name: 'Список рейтингов', path: '/ratings' },
        { name: 'Список разделов', path: '/sections' },
        { name: 'Управление кешем', path: '/cache' },
      ],
    };
  },
};
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
