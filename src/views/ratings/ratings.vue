<template lang="pug">
include /src/mixins.pug
+b.page--ratings.container
  +e.H1.title {{ $route.name }}

  // Button create new rating
  router-link.inline-block(:to='`${pathPage}/create`')
    el-button(type='primary', icon='el-icon-plus') {{ $t('Создать новый рейтинг') }}
  // List ratings
  el-table(:data='ratings', stripe, :scrollbar-always-on='true')
    el-table-column(:label='$t("Название")')
      template(#default='scope')
        router-link.m-1(:to='`${pathPage}/${scope.row.ratingId}`') {{ scope.row.name.ua }}
        div
          el-tag.m-1(type='warning', effect='plain', v-for='sectionId in scope.row.sectionsIds') {{ sectionsMap[sectionId].name.ua }}
    el-table-column(:label='$t("Дата первой  публикации")', width='150')
      template(#default='scope') {{ $utils.date(scope.row.dateFirstPublication) }}
    el-table-column(:label='$t("Дата публикации (создание кеша)")', width='150')
      template(#default='scope')
        span(v-if='scope.row.dateCacheCreation') {{ $utils.date(scope.row.dateCacheCreation, 'datetime') }}
        el-tag(v-else, type='info', effect='dark') {{ $t('Не опубликован') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useStoreSections from '@/store/sections';
import { RatingType, SectionType } from '@/types';

type RatingExtendType = RatingType & { sectionsNames: SectionType['name'][] };

export default defineComponent({
  name: 'page-ratings',
  data() {
    return {
      // loading data
      isLoading: false,
      // Path current page
      pathPage: window.location.pathname,
      // List ratings current user
      ratings: [] as RatingExtendType[],
      // Sections map
      sectionsMap: {} as SectionType[],
    };
  },

  mounted() {
    this.init();
    // Sections
    let store = useStoreSections();
    for (let item of store.$state.items) {
      this.sectionsMap[item.sectionId] = item;
    }
  },

  methods: {
    // Init
    async init() {
      await this.getRatings();
    },

    // Get all ratings User
    async getRatings() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        this.ratings = await this.$api.ratings.getRatings();
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
