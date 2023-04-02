<template lang="pug">
include /src/mixins.pug

+b.EL-FORM.tab-main(v-loading='isLoading', label-position='left', label-width='170px')
  // Sections 
  el-form-item(:error='errors.sectionsIds', :label='$t("Sections")', required)
    el-select(
      size='small',
      multiple,
      filterable,
      allow-create,
      :multiple-limit='sectionsIdsLimit',
      default-first-option,
      v-model='sectionsIds',
      :placeholder='$t("Sections")'
    )
      el-option(
        v-for='item in sections',
        :key='item.sectionId',
        :label='item.name[$lang]',
        :value='item.sectionId'
      )
  // Rating type
  el-form-item(:label='$t("Rating type")')
    el-radio-group(v-model='rating.typeRating')
      el-radio-button(v-for='item in typesRating', :label='item.type', size='small') {{ item.name }}

  // Display
  el-form-item(:label='$t("Display")')
    el-radio-group(v-model='rating.typeDisplay')
      el-radio-button(v-for='item in typesDisplay', :label='item.type', size='small') {{ item.name }}

  // Sort content by
  el-form-item(:label='$t("Sorting")')
    el-radio-group(v-model='rating.typeSort')
      el-radio-button(v-for='item in typesSort', :label='item.type', size='small') {{ item.name }}

  // Name
  el-form-item(:error='errors.name', :label='$t("Name")', required)
    el-input.u-mb--5(
      v-model='rating.name[key]',
      :placeholder='$t("Name")',
      v-for='(value, key) in $langs'
    )
      template(#prepend) {{ key }}

  // Description
  el-form-item(
    :error='errors.descr',
    :label='`${$t("Description")} (${key})`',
    v-for='(value, key) in $langs'
  )
    el-input(
      show-word-limit,
      v-model='rating.descr[key]',
      :placeholder='$t("Description")',
      type='textarea'
    )

  // Hide
  el-form-item(:label='$t("Hide")')
    el-checkbox.u-m--10(v-model='rating.isHiden')
    el-tooltip(
      :content='$t("When you save the section will be removed from the cache. Also when recreating all caches will not be published")',
      placement='top'
    )
      el-icon.u-m--10
        el-icon-question-filled

  // Remove from site
  el-form-item(:label='$t("Remove from site")')
    el-button(
      type='danger',
      @click='deleteCacheRating(rating.ratingId)',
      :disabled='!rating.dateCacheCreation'
    ) {{ $t('Delete from cache') }}

  // Add to cache
  el-form-item(:label='$t("Publish")')
    el-button(
      type='warning',
      @click='createCacheRating(rating.ratingId)',
      :disabled='isCacheUpdateDisabled'
    ) {{ $t('Add to cache') }}
    el-tooltip(placement='top', v-if='isCacheUpdateDisabled')
      template(#content)
        div {{ $t('The rating cannot be published if:') }}
        div 1. {{ $t('If the rating is hidden') }}
        div 2. {{ $t('If there is no content to post, or the content is hidden') }}
      el-icon.u-m--10
        el-icon-question-filled

  el-form-item(:label='$t("Publication date")') {{ $utils.date(rating.dateFirstPublication, 'datetime') }}
  el-form-item(:label='$t("Cache Creation Date")') {{ $utils.date(rating.dateCacheCreation, 'datetime') }}

  +e.bottom
    el-button(v-if='!rating.ratingId', type='primary', @click='createRating()') {{ $t('Create rating') }}
    el-button(v-if='rating.ratingId', type='primary', @click='editRating()') {{ $t('Save your changes') }}
    el-button(v-if='rating.ratingId', type='danger', @click='deleteRating()') {{ $t('Delete') }}
</template>

<script lang="ts">
import {
  RatingType,
  LabelType,
  SectionType,
  RatingTypeTypeEnum,
  RatingDisplayTypeEnum,
  RatingSortTypeEnum,
  ValueOfType,
} from '@/types';
import { defineComponent } from 'vue';
import useStoreSections from '@/store/sections';
import { $langsInit } from '@/plugins/translations';

let ratingInit = (): Omit<RatingType, 'userId'> => {
  return {
    ratingId: 0,
    // Selected sections
    sectionsIds: {},
    // Name rating
    name: $langsInit(),
    // Descriptin rating
    descr: $langsInit(),
    // Hidden rating
    isHiden: false,
    // Rating type
    typeRating: RatingTypeTypeEnum.site,
    // Display "tile" / "list"
    typeDisplay: RatingDisplayTypeEnum.tile,
    // The order of output of rating elements
    typeSort: RatingSortTypeEnum.alexa,
    // Number of items total
    countRatingItemsTotal: 0,
    // Number of items hidden
    countRatingItemsHidden: 0,
    // Date cache creation
    dateCacheCreation: null,
    // Date first publication
    dateFirstPublication: null,
  };
};

export default defineComponent({
  props: {
    // Rating id
    ratingId: {
      type: Number,
      default: null,
    },
  },
  computed: {
    // If rating visible and no empy
    isCacheUpdateDisabled(): boolean {
      if (!(this.rating.countRatingItemsTotal - this.rating.countRatingItemsHidden)) return true;
      if (this.ratingIsHiden) return true;
      return false;
    },
  },

  data() {
    return {
      initialStateRating: '',
      ratingIsHiden: true,
      // Rating data
      rating: ratingInit() as RatingType,
      // id sections - needed because the component works with an array, and an object is sent to the server (field "rating")
      sectionsIds: [] as number[],
      // List rating types
      typesRating: [] as {
        type: ValueOfType<typeof RatingTypeTypeEnum>;
        name: string;
      }[],
      // List display types
      typesDisplay: [] as { type: ValueOfType<typeof RatingDisplayTypeEnum>; name: string }[],
      // List sort types
      typesSort: [] as { type: ValueOfType<typeof RatingSortTypeEnum>; name: string }[],
      // labels
      labels: [] as LabelType[],
      // Sections
      sections: [] as SectionType[],
      // Maximum number of partitions
      sectionsIdsLimit: 2,
      // isLoading
      isLoading: false,
      // Messages
      errors: {
        name: '',
        descr: '',
        server: '',
        sectionsIds: '',
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      // Types params rating
      this.typesDisplay = [
        { type: RatingDisplayTypeEnum.tile, name: this.$t('Tile') },
        { type: RatingDisplayTypeEnum.inline, name: this.$t('Line') },
      ];
      this.typesRating = [{ type: RatingTypeTypeEnum.site, name: this.$t('Sites') }];
      this.typesSort = [
        { type: RatingSortTypeEnum.alexa, name: this.$t('Alexa Rank') },
        { type: RatingSortTypeEnum.click, name: this.$t('Clicks') },
      ];

      // Sections
      let store = useStoreSections();
      this.sections = store.$state.items;

      // Data
      if (this.ratingId) {
        await this.getRating(Number(this.ratingId));
      }
    },

    // Get data rating
    async getRating(ratingId: number) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.rating = await this.$api.ratings.getRating({ ratingId });
        this.sectionsIds = Object.values(this.rating.sectionsIds) as number[];
        this.ratingIsHiden = this.rating.isHiden;
        this.initialStateRating = JSON.stringify(this.rating);
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Create rating
    async createRating() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);
      let ratingIdNew = null;

      try {
        let sectionsIds = this.sectionsIds.reduce((a, v) => ({ ...a, [v]: v }), {});
        let { ratingId, name } = await this.$api.ratings.createRating({
          ...this.rating,
          sectionsIds,
        });

        this.$utils.showMessageSuccess({
          message: this.$t('Rating created'),
        });

        ratingIdNew = ratingId;
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        this.$utils.setErrors(this.errors, errors.errors);
      } finally {
        this.isLoading = false;
      }

      // If success (try)
      if (ratingIdNew) {
        try {
          await this.getRating(ratingIdNew);
          // Go to the rating created page
          this.$router.push({ path: `/ratings/${ratingIdNew}` });
        } catch (error) {
          // Go to the list ratings created page
          this.$router.push({ path: `/ratings` });
        }
      }
    },

    // Edit rating
    async editRating() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);
      let isSuccess = false;
      try {
        await this.$api.ratings.editRating(this.preparingRatingDataForSavingEdit());

        this.$utils.showMessageSuccess({
          message: this.$t('Rating changed'),
        });

        isSuccess = true;
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        this.$utils.setErrors(this.errors, errors.errors);
      } finally {
        this.isLoading = false;
      }

      if (isSuccess) {
        await this.getRating(this.rating.ratingId);
      }
    },

    // The method is necessary to repeat the preparation algorithm in several places
    preparingRatingDataForSavingEdit() {
      let sectionsIds = this.sectionsIds.reduce((a, v) => ({ ...a, [v]: v }), {});
      return { ...this.rating, sectionsIds };
    },

    // Delete rating
    async deleteRating() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Are you sure you want to delete?'),
      });

      this.isLoading = true;

      try {
        await this.$api.cache.deleteCacheRating({ ratingId: this.ratingId });
        await this.$api.ratings.deleteRating({ ratingId: this.ratingId });

        this.$utils.showMessageSuccess({
          message: this.$t('Rating removed'),
        });
        this.$router.push({ path: `/ratings` });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        if (errors.errors.rating) {
          this.$utils.showMessageError({ message: errors.errors.rating });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Create cache
    async createCacheRating(ratingId: RatingType['ratingId']) {
      if (this.initialStateRating !== JSON.stringify(this.preparingRatingDataForSavingEdit())) {
        this.$utils.showDialogAlert({
          message: this.$t('To create a cache, you need to save changes'),
        });
        return;
      }

      let isSuccess = false;
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        isSuccess = await this.$api.cache.createCacheRating({ ratingId });
        this.$utils.showMessageSuccess({
          message: this.$t('Rating published'),
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }

      if (isSuccess) {
        await this.getRating(ratingId);
      }
    },

    // Delete cache
    async deleteCacheRating(ratingId: RatingType['ratingId']) {
      let isSuccess = false;
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        await this.$api.cache.deleteCacheRating({ ratingId });
        this.$utils.showMessageSuccess({
          message: this.$t('The rating is not displayed on the website'),
        });
        isSuccess = true;
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
      } finally {
        this.isLoading = false;
      }

      if (isSuccess) {
        await this.getRating(ratingId);
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.tab-main
  &__bottom
    display: flex
    justify-content: space-between
</style>
