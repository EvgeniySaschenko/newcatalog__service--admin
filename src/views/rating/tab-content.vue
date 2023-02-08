<template lang="pug">
include /src/mixins.pug

// Список сайтов
+b.sites-list
  +e.panel-top
    +e.EL-BUTTON.btn-add-item(
      type='primary',
      @click='toggleDialogRatingItem(true, {})',
      :loading='isLoading'
    ) {{ $t("Добавить") }}

  +e.list
    +e.item(v-for='item of ratingItems')
      +e.row-top
        +e.box-img(:style='{ backgroundColor: item.site.color }')
          +e.IMG.img.sites-list__img(:src='item.site.img', :alt='item.name.ru')
        +e.name 
          +e.name-text {{ item.name.ru }}
        +e.A.link(:href='item.url', target='_blank') {{ getHost(item.url) }}
        div {{ item.site.alexaRank }}
        br
        //div {{ (item.site.whois.creationDate || item.site.whois.created || (item.site.whois.createdOn || "").slice(7, 11) || "").slice(0, 4) }}

        +e.labels
          template(v-for='label in labels') 
            .label-rating(
              v-if='item.labelsIds[label.labelId]',
              :style='{ backgroundColor: label.color }'
            ) {{ label.name.ru }}

      +e.row-bottom
        +e.status
          +e.EL-TAG.status-item(v-if='item.isHiden', effect='dark', size='small', type='info') {{ $t("Скрыт") }}
        +e.EL-BUTTON.btn--edit(
          type='primary',
          @click='toggleDialogRatingItem(true, item)',
          size='small'
        ) {{ $t("Редактировать") }}

// Диалоговое окно для редактирования сайта
dialog-rating-item(
  v-if='isShowDialogRatingItem',
  :labels='labels',
  :ratingId='ratingId',
  :itemCurrent='itemCurrent',
  :labelsIdsLimit='labelsIdsLimit',
  @rating-item:update='getRatingItems()',
  @dialog:closed='toggleDialogRatingItem(false, {})'
)
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RatingItemType, LabelType, RatingType } from '@/types';

import DialogRatingItem from './dialog-rating-item.vue';

export default defineComponent({
  mounted() {
    this.init();
  },
  data() {
    return {
      isShowDialogRatingItem: false,
      // Rating main data
      rating: {} as RatingType,
      // Labels this rating
      labels: [] as LabelType[],
      // Curent element from edit
      itemCurrent: {} as RatingItemType,
      // Rating items
      ratingItems: [] as RatingItemType[],
      // Labels max quantity
      labelsIdsLimit: 5,
      // Loading data
      isLoading: false,
      // Errors messages
      errors: {
        server: '',
      },
    };
  },
  props: {
    // Rating id
    ratingId: {
      type: Number,
      default: null,
    },
  },
  components: {
    DialogRatingItem,
  },
  methods: {
    // Init
    async init() {
      await this.getRating();
      await this.getRatingLabels();
      await this.getRatingItems();
    },

    // Get data rating
    async getRating() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.rating = await this.$api.ratings.getRating({ ratingId: this.ratingId });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Get data rating labels
    async getRatingLabels() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.labels = await this.$api['labels'].getLabels({ ratingId: this.ratingId });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Get data rating items
    async getRatingItems() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.ratingItems = await this.$api['ratings-items'].getItems({
          ratingId: this.ratingId,
          typeSort: this.rating.typeSort,
        });
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Get host from url
    getHost(url: string) {
      let { host } = new URL(url);
      return host;
    },

    // Toggle dialog rating item
    toggleDialogRatingItem(isShow: boolean, item: RatingItemType) {
      this.isShowDialogRatingItem = isShow;
      this.itemCurrent = item;
    },
  },
});
</script>

<style lang="sass" scoped>
.sites-list
  &__panel-top
    margin-bottom: 10px
    display: flex
    justify-content: flex-end
  &__list
    display: flex
    flex-wrap: wrap
  &__item
    display: flex
    flex-direction: column
    width: calc(100% / 3)
    text-align: center
    justify-content: space-between
    box-shadow: 0 0 2px inset rgba(0,0,0,0.3)
    padding: 15px
  &__status
    &-item
      margin: 5px
  &__box-img
    height: 120px
    padding: 10px
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 10px
  &__img
    margin-bottom: 5px
    max-height: 100%
    max-width: 100%
  &__link
    margin-bottom: 5px
    display: block
    white-space: nowrap
    padding: 0 10px
    text-overflow: ellipsis
    overflow: hidden
  &__name
    height: 35px
    margin-bottom: 5px
    &-text
      overflow: hidden
      text-overflow: ellipsis
      -webkit-line-clamp: 2
      line-clamp: 2
      display: -webkit-box
      -webkit-box-orient: vertical
      box-orient: vertical
  &__labels
    width: 100%
    margin-bottom: 10px
  &__btn
    margin: 0 5px
    margin-bottom: 10px
</style>
