<template lang="pug">
include /src/mixins.pug

.wrapper
  .container
    header
      menu-main
    router-view
    footer
</template>

<script>
import MenuMain from '@/components/menu-main/menu-main.vue';

export default {
  components: {
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
