<template lang="pug">
include /src/mixins.pug
+b.page--ratings.container
  +e.H1.title {{ $route.name }}

  // Button create new rating
  router-link.inline-block(:to='`${pathPage}/create`')
    el-button(type='primary', icon='el-icon-plus') {{ $t("Создать новый рейтинг") }}
  // List ratings
  el-table(:data='ratings', stripe, :scrollbar-always-on='true')
    el-table-column(:label='$t("Название")')
      template(#default='scope')
        router-link(:to='`${pathPage}/${scope.row.id}`') {{ scope.row.name.ua }}
    el-table-column(:label='$t("Дата создания")', width='150')
      template(#default='scope') {{ $utils.date(scope.row.dateCreate) }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useStoreUser from '@/pinia/user';
import { RatingType } from '@/types';

export default defineComponent({
  name: 'page-ratings',
  data() {
    return {
      // loading data
      isLoading: false,
      // Path current page
      pathPage: window.location.pathname,
      // List ratings current user
      ratings: [] as RatingType[],
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    // Init
    init() {
      this.getRatings();
    },

    // Get all ratings User
    async getRatings() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let store = useStoreUser();
        this.ratings = await this.$api.ratings.getRatingsUser({ userId: store.$state.id });
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

<style lang="sass" scoped></style>
