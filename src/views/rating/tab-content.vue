<template lang="pug">
include /src/mixins.pug

el-alert(v-if='success', :title='success', type='success')
el-alert(v-if='errors.server', :title='errors.server', type='error')

// Список сайтов
+b.sites-list
  +e.panel-top
    +e.EL-BUTTON.btn-add-item(
      v-if='rating.typeRating == "site"',
      type='primary',
      @click='itemCurrent = {}',
      :loading='isSending'
    ) Добавить

    +e.EL-BUTTON.btn-sennd-labels(
      :type='countLabelsItemsChanged ? "success" : "info"',
      @click='editRatingLabels()',
      :loading='isSending'
    ) Сохранить изменённые ярлыки

  +e.list
    +e.item(v-for='item of rating.items')
      +e.row-top
        +e.box-img(:style='{ backgroundColor: item.img.color }')
          +e.IMG.img.sites-list__img(:src='item.img.url', :alt='item.name.ua')
        +e.name 
          +e.name-text {{ item.name.ua }}
        +e.A.link(:href='item.url', target='_blank') {{ getHost(item.url) }}
        div {{ item.alexaRank }}
        br
        div {{ (item.whois.creationDate || item.whois.created || (item.whois.createdOn || "").slice(7, 11) || "").slice(0, 4) }}

        +e.EL-SELECT.labels(
          multiple,
          :multiple-limit='labelsIdsLimit',
          v-model='stateItems[item.id].labelsIds',
          placeholder='Ярлыки',
          @change='createLabelsChangeList($event, item.id)'
        )
          el-option(
            v-for='item in rating.labels',
            :key='item.id',
            :label='item.name.ua',
            :value='item.id'
          )

      +e.row-bottom
        +e.status
          +e.EL-TAG.status-item(v-if='item.isHiden', effect='dark', size='small', type='info') Скрыт

        +e.EL-BUTTON.btn--delete(
          type='danger',
          @click='deleteRatingItem(item.id)',
          size='small'
        ) Удалить
        +e.EL-BUTTON.btn--edit(type='primary', @click='itemCurrent = item', size='small') Редактировать

// Диалоговое окно для редактирования сайта
dialog-rating-item(
  v-if='itemCurrent',
  :itemCurrent='itemCurrent',
  :labelsIdsLimit='labelsIdsLimit',
  @closed='itemCurrent = null'
)

dialog-confirm-delete(ref='dialog-confirm')
</template>

<script>
import DialogRatingItem from './dialog-rating-item.vue';
import DialogConfirmDelete from '@/components/dialog-confirm-delete/dialog-confirm-delete.vue';
import _lib from '@/plugins/_lib';

export default {
  data() {
    return {
      // Текущий елемент для редактирования
      itemCurrent: null,
      // Состояние Items
      stateItems: {},
      // Максимьное количество ярлыков
      labelsIdsLimit: 5,
      // Указывает на то что данные отправляются
      isSending: false,
      // Список изменённых ярлыков для изменённых items - чтобы массово сохранить
      labelsChangedListByItem: {},
      // Сообщение об ошибке / успехе
      errors: {},
      success: '',
    };
  },
  components: {
    DialogRatingItem,
    DialogConfirmDelete,
  },
  computed: {
    // Указывает на то что ярлыки items изменялись
    countLabelsItemsChanged() {
      return Object.values(this.labelsChangedListByItem).length;
    },
    // Рейтинг
    rating() {
      return this.$store.state['page-rating'];
    },
  },
  watch: {
    rating: {
      deep: true,
      immediate: true,
      handler() {
        this.createState();
      },
    },
  },
  methods: {
    // Создать состояние
    createState() {
      let { items } = this.rating;
      if (items.length) {
        this.labelsChangedListByItem = {};
        for (let item of items) {
          this.stateItems[item.id] = {
            labelsIds: _lib.transformObjToArray(item.labelsIds),
          };
        }
      }
    },

    // Получить домен из Хост
    getHost(url) {
      let { host } = new URL(url);
      return host;
    },

    // Очистить сообщения
    clearMessages() {
      for (let item in this.errors) {
        this.errors[item] = '';
      }
      this.success = '';
    },

    // Добавить сообщения об ошибке
    setErrors(errors) {
      // Если это ошибка, а не объект
      if (errors instanceof Error) {
        this.errors.server = 'Ошибка сервера';
        return;
      }

      for (let item in errors) {
        this.errors[item] = errors[item];
      }
    },

    // Редактировать ярлыки рейтинга
    async editRatingLabels() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      let labelsItems = {};

      for (let key in this.labelsChangedListByItem) {
        labelsItems[key] = _lib.transformArrToObject(this.labelsChangedListByItem[key]);
      }

      await this.$store
        .dispatch('page-rating/editRatingLabels', {
          labelsItems,
          ratingId: this.rating.id,
          typeSort: this.rating.typeSort,
        })
        .then(() => {
          this.success = 'Ярлыки изменены';
          this.labelsChangedListByItem = {};
        })
        .catch((errors) => {
          this.setErrors(errors);
        })
        .finally(() => {
          this.isSending = false;
        });
    },

    // Создать список изменённых ярлыков
    createLabelsChangeList(labelsIds, itemId) {
      this.labelsChangedListByItem[itemId] = labelsIds;
    },

    // Удалить елемент
    async deleteRatingItem(id) {
      let isDelete = await this.$refs['dialog-confirm'].show();
      if (!isDelete) return;
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      await this.$store
        .dispatch('page-rating/deleteRatingItem', {
          id,
          ratingId: this.rating.id,
          typeSort: this.rating.typeSort,
        })
        .then(() => {
          this.success = 'Елемент удалён';
        })
        .catch((errors) => {
          this.setErrors(errors);
        })
        .finally(() => {
          this.isSending = false;
        });
    },
  },
};
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
