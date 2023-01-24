<template lang="pug">
include /src/assets/pug/index.pug
// Диалоговое окно для редактирования / создания элемента рейтинга
el-dialog(v-model='isShow', :title='state.name.ua')
  el-form(label-position='top', v-loading='isSending')
    .dialog-site-edit__box-img(:style='{ backgroundColor: state.img.color }', v-if='!isAddItem')
      img.dialog-site-edit__img(:src='state.img.url', :alt='state.name.ua')
    // Ссылка
    el-form-item(:error='errors.url', label='Ссылка', required)
      el-input(placeholder='Ссылка', size='small', v-model='state.url', :disabled='!isAddItem')
    // Название   
    el-form-item(:error='errors.name', label='Название ua')
      el-input(placeholder='Название', size='small', v-model='state.name.ua')
    el-form-item(:error='errors.name', label='Название ru')
      el-input(placeholder='Название', size='small', v-model='state.name.ru')
    // Ярлыки  
    el-form-item
      el-select(
        size='small',
        multiple,
        filterable,
        allow-create,
        :multiple-limit='labelsIdsLimit',
        default-first-option,
        v-model='state.labelsIds',
        style='width: 100%',
        placeholder='Ярлыки'
      )
        el-option(
          v-for='item in rating.labels',
          :key='item.id',
          :label='item.name.ua',
          :value='item.id'
        )
    // Приоритет  
    el-form-item
      el-input-number(v-model='state.priority', size='small', placeholder='Приоритет')
    el-form-item
      el-checkbox(v-model='state.isHiden') Скрыть
      el-checkbox(v-model='state.isCreatedScreen') Создать скриншот
      +e.EL-BUTTON.btn--screenshot(
        type='warning',
        @click='createScreenshotRatingItem()',
        size='small'
      ) Создать скриншот
      +e.EL-BUTTON.btn--screenshot(
        type='warning',
        @click='createScreenshotRatingItem()',
        size='small'
      ) Вернуть изображение на доработку

  el-upload.upload-demo(action='...')
    el-button(type='primary', size='small') Загрузить изображение

  el-alert(v-if='success', :title='success', type='success')
  el-alert(v-if='errors.server', :title='errors.server', type='error')

  template(#footer)
    el-button(v-if='!isAddItem', type='success', @click='editRatingItem()') Сохранить
    el-button(v-if='isAddItem', type='success', @click='createRatingItem()') Создать
</template>

<script>
import _lib from '@/plugins/_lib';

export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      // Указывает на то что добавляется новый елемент
      isAddItem: false,
      // Состояние
      state: {
        name: {},
        url: '',
        labelsIds: [],
        ratingId: 0,
        priority: 0,
        isCreatedScreen: false,
        isHiden: false,
        // Нужуно в store чтобы получить все items
        typeSort: '',
      },
      // Показать диалоговое окно
      isShow: true,
      // Указывает на то что выполняется отправка
      isSending: false,
      // Сообщения
      errors: {
        name: '',
        url: '',
        server: '',
      },
      success: '',
    };
  },
  computed: {
    rating() {
      return this.$store.state['page-rating'];
    },
  },

  props: {
    // Текущий елемент для редактировани
    itemCurrent: {
      type: Object,
      default: () => {},
    },

    // Максимьное количество ярлыков
    labelsIdsLimit: {
      type: Number,
    },
  },
  methods: {
    // Подготовка данных
    init() {
      this.isAddItem = Object.keys(this.itemCurrent).length ? false : true;
      this.state.ratingId = this.rating.id;
      this.state.typeSort = this.rating.typeSort;
      if (this.isAddItem) return;
      // Если редактирование
      Object.assign(
        this.state,
        { ...this.itemCurrent },
        { labelsIds: _lib.transformObjToArray(this.itemCurrent.labelsIds) }
      );
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

    // Создать елемент
    async createRatingItem() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      await this.$store
        .dispatch('page-rating/createRatingItem', {
          ...this.state,
          labelsIds: _lib.transformArrToObject(this.state.labelsIds),
        })
        .then(() => {
          this.state.name = {};
          this.state.priority = 0;
          this.success = 'Елемент добавлен';
        })
        .catch((errors) => {
          this.setErrors(errors);
        })
        .finally(() => {
          this.isSending = false;
        });
    },

    // Создать елемент
    async editRatingItem() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      await this.$store
        .dispatch('page-rating/editRatingItem', {
          ...this.state,
          labelsIds: _lib.transformArrToObject(this.state.labelsIds),
        })
        .then(() => {
          this.success = 'Елемент изменён';
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
.dialog-site-edit
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
</style>
