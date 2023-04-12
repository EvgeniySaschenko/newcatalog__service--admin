<template lang="pug">
include /src/mixins.pug

+b.EL-MENU.menu-main(:default-active='$route.path', mode='horizontal')
  +e.EL-MENU-ITEM.item(:index='item.path', v-for='item in items')
    +e.ROUTER-LINK.link(:to='item.path') {{ $t(item.name) }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { $routesMap } from '@/router';
import { $config } from '@/plugins/config';

export default defineComponent({
  name: 'menu-main',
  data() {
    return {
      items: [] as { name: string; path: string }[],
    };
  },

  created() {
    this.items = $config['main-menu'].map((key) => {
      return {
        name: $routesMap[key].name,
        path: $routesMap[key].path,
      };
    });
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
