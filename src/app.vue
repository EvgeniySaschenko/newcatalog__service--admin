<template lang="pug">
include /src/mixins.pug

.wrapper
  header.container
    app-menu-main
  router-view(v-loading='isLoading')
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
    };
  },
  components: {
    AppMenuMain,
  },
  mounted() {
    this.getSections();
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
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 200);
      }
    },
  },
});
</script>

<style lang="sass">
@import "@/assets/style/_style.sass"
</style>
