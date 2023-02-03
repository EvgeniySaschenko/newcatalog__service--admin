<template lang="pug">
include /src/mixins.pug

el-form(v-loading='isLoading', label-position='left', label-width='150px')
  // Разделы 
  el-form-item(:error='errors.sectionsIds', :label='$t("Разделы")', required)
    el-select(
      multiple,
      filterable,
      allow-create,
      :multiple-limit='sectionsIdsLimit',
      default-first-option,
      v-model='sectionsIds',
      :placeholder='$t("Разделы")'
    )
      el-option(v-for='item in sections', :key='item.id', :label='item.name.ua', :value='item.id')
  // Тип рейтинга
  el-form-item(:label='$t("Тип рейтинга")')
    el-radio-group(v-model='rating.typeRating')
      el-radio-button(v-for='item in typesRating', :label='item.type', size='small') {{ item.name }}

  // Отображение
  el-form-item(:label='$t("Отображение")')
    el-radio-group(v-model='rating.typeDisplay')
      el-radio-button(v-for='item in typesDisplay', :label='item.type', size='small') {{ item.name }}

  // Упорядочить контент по
  el-form-item(:label='$t("Упорядочить контент по:")')
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
    el-checkbox(v-model='rating.isHiden')

  el-button(v-if='!rating.id', type='primary', @click='createRating()') {{ $t("Создать рейтинг") }}
  el-button(v-else, type='primary', @click='editRating()') {{ $t("Редактировать рейтинг") }}
</template>

<script lang="ts">
import {
  RatingType,
  LabelType,
  SectionType,
  RatingTypeType,
  RatingDisplayType,
  RatingSortType,
  LangInit,
} from '@/types';
import { defineComponent } from 'vue';
import useStoreSections from '@/store/sections';

let ratingInit = (): RatingType => {
  return {
    id: 0,
    // Selected sections
    sectionsIds: {},
    // Name rating
    name: LangInit(),
    // Descriptin rating
    descr: LangInit(),
    // Hidden rating
    isHiden: true,
    // Тип рейтинга
    typeRating: 'site' as RatingTypeType,
    // Отображать "плиткой" / "списком"
    typeDisplay: 'tile' as RatingDisplayType,
    // Порядок вывода елементов рейтинга
    typeSort: 'alexa' as RatingSortType,
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
  data() {
    return {
      // Rating data
      rating: ratingInit() as RatingType,
      // id sections - needed because the component works with an array, and an object is sent to the server (field "rating")
      sectionsIds: [] as number[],
      // List rating types
      typesRating: [] as { type: RatingTypeType; name: string }[],
      // List display types
      typesDisplay: [] as { type: RatingDisplayType; name: string }[],
      // List sort types
      typesSort: [] as { type: RatingSortType; name: string }[],
      // labels
      labels: [] as LabelType[],
      // Sections
      sections: [] as SectionType[],
      // Максимьное количество разделов
      sectionsIdsLimit: 3,
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
        { type: 'tile', name: this.$t('Плитка') },
        { type: 'inline', name: this.$t('Линия') },
      ];
      this.typesRating = [{ type: 'site', name: this.$t('Сайты') }];
      this.typesSort = [
        { type: 'alexa', name: this.$t('Alexa Rank') },
        { type: 'click', name: this.$t('Клики') },
      ];

      // Sections
      let store = useStoreSections();
      this.sections = store.$state.items.filter((el) => el.isHiden === false);

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
        let { id, name } = await this.$api.ratings.createRating({
          ...this.rating,
          sectionsIds,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Рейтинг создан')}: "${name.ru}"`,
        });

        ratingIdNew = id;
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

      try {
        let sectionsIds = this.sectionsIds.reduce((a, v) => ({ ...a, [v]: v }), {});
        await this.$api.ratings.editRating({
          ...this.rating,
          sectionsIds,
        });

        this.$utils.showMessageSuccess({
          message: `${this.$t('Рейтинг изменён')}: "${this.rating.name.ru}"`,
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        this.$utils.setErrors(this.errors, errors.errors);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
