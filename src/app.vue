<template lang="pug">
include /src/mixins.pug

.wrapper
  header.container
    app-menu-main
  div(v-loading='isLoading')
    router-view(v-if='isSectionsRedy')
  footer.container
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppMenuMain from '@/components/app-menu-main/app-menu-main.vue';
import useSectionsStore from '@/store/sections';

export default defineComponent({
  data() {
    return {
      isLoading: false,
      isSectionsRedy: false,
    };
  },
  components: {
    AppMenuMain,
  },
  async mounted() {
    await this.getSections();
  },

  methods: {
    // Get sections
    async getSections() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        let store = useSectionsStore();
        let sections = await this.$api.sections.getSections();
        store.setSections(sections);
        this.isSectionsRedy = true;
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass">
@import "@/assets/style/_style.sass"
</style>
