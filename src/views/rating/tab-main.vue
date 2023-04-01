<template lang="pug">
include /src/mixins.pug

+b.EL-FORM.tab-main(v-loading='isLoading', label-position='left', label-width='170px')
  // Разделы 
  el-form-item(:error='errors.sectionsIds', :label='$t("Разделы")', required)
    el-select(
      size='small',
      multiple,
      filterable,
      allow-create,
      :multiple-limit='sectionsIdsLimit',
      default-first-option,
      v-model='sectionsIds',
      :placeholder='$t("Разделы")'
    )
      el-option(
        v-for='item in sections',
        :key='item.sectionId',
        :label='item.name.ua',
        :value='item.sectionId'
      )
  // Тип рейтинга
  el-form-item(:label='$t("Тип рейтинга")')
    el-radio-group(v-model='rating.typeRating')
      el-radio-button(v-for='item in typesRating', :label='item.type', size='small') {{ item.name }}

  // Отображение
  el-form-item(:label='$t("Отображение")')
    el-radio-group(v-model='rating.typeDisplay')
      el-radio-button(v-for='item in typesDisplay', :label='item.type', size='small') {{ item.name }}

  // Упорядочить контент по
  el-form-item(:label='$t("Сортировка:")')
    el-radio-group(v-model='rating.typeSort')
      el-radio-button(v-for='item in typesSort', :label='item.type', size='small') {{ item.name }}

  // Название
  el-form-item(:error='errors.name', :label='$t("Название ua")', required)
    el-input(v-model='rating.name.ua', :placeholder='$t("Название")', :maxlength='nameMaxLength') 
  el-form-item(:error='errors.name', :label='$t("Название ru")', required)
    el-input(v-model='rating.name.ru', :placeholder='$t("Название")', :maxlength='nameMaxLength') 
  // Описание
  el-form-item(:error='errors.descr', :label='$t("Описание ua")')
    el-input(
      show-word-limit,
      v-model='rating.descr.ua',
      :placeholder='$t("Описание")',
      type='textarea',
      :maxlength='descrMaxLength'
    )
  el-form-item(:error='errors.descr', :label='$t("Описание ru")')
    el-input(
      show-word-limit,
      v-model='rating.descr.ru',
      :placeholder='$t("Описание")',
      type='textarea',
      :maxlength='descrMaxLength'
    )

  el-form-item(:label='$t("Скрыть")')
    el-checkbox.u-m--10(v-model='rating.isHiden')
    el-tooltip(
      :content='$t("При сохранении раздел будет удалён из кэша. Так же при пересоздании всех кешей не будет опубликован.")',
      placement='top'
    )
      el-icon.u-m--10
        el-icon-question-filled

  el-form-item(:label='$t("Убрать с сайта")')
    el-button(
      type='danger',
      @click='deleteCacheRating(rating.ratingId)',
      :disabled='!rating.dateCacheCreation'
    ) {{ $t('Удалить из кэша') }}

  el-form-item(:label='$t("Опубликовать")')
    el-button(
      type='warning',
      @click='createCacheRating(rating.ratingId)',
      :disabled='isCacheUpdateDisabled'
    ) {{ $t('Добавить в кэш') }}
    el-tooltip(placement='top', v-if='isCacheUpdateDisabled')
      template(#content)
        div {{ $t('Рейтинг нельзя опубликовать:') }}
        div {{ $t('1. Если рейтинг скрыт') }}
        div {{ $t('2. Если нём нет контента для публикации, или контент скрыт') }}
      el-icon.u-m--10
        el-icon-question-filled

  el-form-item(:label='$t("Дата публикации")') {{ $utils.date(rating.dateFirstPublication, 'datetime') }}
  el-form-item(:label='$t("Дата создания кэша")') {{ $utils.date(rating.dateCacheCreation, 'datetime') }}

  +e.bottom
    el-button(v-if='!rating.ratingId', type='primary', @click='createRating()') {{ $t('Создать рейтинг') }}
    el-button(v-if='rating.ratingId', type='primary', @click='editRating()') {{ $t('Сохранить изменения') }}
    el-button(v-if='rating.ratingId', type='danger', @click='deleteRating()') {{ $t('Удалить') }}
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
  LangInit,
} from '@/types';
import { defineComponent } from 'vue';
import useStoreSections from '@/store/sections';

let ratingInit = (): Omit<RatingType, 'userId'> => {
  return {
    ratingId: 0,
    // Selected sections
    sectionsIds: {},
    // Name rating
    name: LangInit(),
    // Descriptin rating
    descr: LangInit(),
    // Hidden rating
    isHiden: false,
    // Тип рейтинга
    typeRating: RatingTypeTypeEnum.site,
    // Отображать "плиткой" / "списком"
    typeDisplay: RatingDisplayTypeEnum.tile,
    // Порядок вывода елементов рейтинга
    typeSort: RatingSortTypeEnum.alexa,
    // Количество items всего
    countRatingItemsTotal: 0,
    // Количество items скрытых
    countRatingItemsHidden: 0,
    dateCacheCreation: null,
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
      // Максимьное количество разделов
      sectionsIdsLimit: 2,
      // Максимальное количество символов
      nameMaxLength: 150,
      // Минимальное количество символов
      nameMinLength: 15,
      // Максимальная длина описания
      descrMaxLength: 1000,
      // isLoading
      isLoading: false,
      // Сообщения
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
        { type: RatingDisplayTypeEnum.tile, name: this.$t('Плитка') },
        { type: RatingDisplayTypeEnum.inline, name: this.$t('Линия') },
      ];
      this.typesRating = [{ type: RatingTypeTypeEnum.site, name: this.$t('Сайты') }];
      this.typesSort = [
        { type: RatingSortTypeEnum.alexa, name: this.$t('Alexa Rank') },
        { type: RatingSortTypeEnum.click, name: this.$t('Клики') },
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
          message: `${this.$t('Рейтинг создан')}: "${name.ru}"`,
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
          message: `${this.$t('Рейтинг изменён')}: "${this.rating.name.ru}"`,
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
        title: `${this.$t('Вы действительно хотите удалить?')} "${this.rating.name.ru}"`,
      });

      this.isLoading = true;

      try {
        await this.$api.cache.deleteCacheRating({ ratingId: this.ratingId });
        await this.$api.ratings.deleteRating({ ratingId: this.ratingId });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Рейтинг удалён')}: "${this.rating.name.ru}"`,
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
          message: this.$t('Для создания кэша необходимо сохранить изменения.'),
        });
        return;
      }

      let isSuccess = false;
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        isSuccess = await this.$api.cache.createCacheRating({ ratingId });
        this.$utils.showMessageSuccess({
          message: this.$t('Рейтинг опубликован'),
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
          message: this.$t('Рейтинг не отображается на сайте'),
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
