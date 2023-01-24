<template lang="pug">
include /src/assets/pug/index.pug
.wrapper
  app-svg-symbol
  .container
    header
      menu-main
    router-view
    footer
</template>

<script>
import AppSvgSymbol from '@/components/svg-symbol/svg-symbol.vue';
import MenuMain from '@/components/menu-main/menu-main.vue';

export default {
  components: {
    AppSvgSymbol,
    MenuMain,
  },
  mounted() {
    this.$store.dispatch('sections/getSections');
  },
};
</script>

<style lang="sass">
@import "@/assets/style/_style.sass"
</style>
