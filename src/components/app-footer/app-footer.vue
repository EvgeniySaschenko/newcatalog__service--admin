<template lang="pug">
include /src/mixins.pug
+b.FOOTER.app-footer
  .container
    +e.row NEWCATALOG
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'app-footer',
});
</script>

<style lang="sass" scoped>
@import "@/assets/style/_variables.sass"
.app-footer
  padding: 20px 0
  background-color: $app-primary-color
  text-align: center
  margin-top: 40px
  color: #ffffff
  font-weight: 700
</style>
