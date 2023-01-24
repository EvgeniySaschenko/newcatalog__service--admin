<template lang="pug">
include /src/assets/pug/index.pug
el-dialog(:title='title', v-model='isShow')
  +b.EL-FORM.dialog-label-rating(label-position='top', v-loading='isSending')
    el-form-item(:error='errors.name', label='Название ua')
      el-input(placeholder='Текст ярлыка', v-model='label.name.ua', required)
    el-form-item(:error='errors.name', label='Название ru')
      el-input(placeholder='Текст ярлыка', v-model='label.name.ru', required)
    el-form-item(:error='errors.color', label='Цвет ярлыка')
      +e.colors
        +e.colors-item(
          v-for='item in colorsDefault',
          :style='{ backgroundColor: item, borderColor: label.color == item ? label.color : "#fff" }',
          :key='item',
          @click='setColor(item)'
        )
        el-color-picker(v-model='label.color')
    el-form-item(label='Ярлык')
      .label-rating(:style='{ backgroundColor: label.color }') {{ label.name.ua }}
  // Сообщение при отправке   
  el-alert(v-if='success', :title='success', type='success')
  el-alert(v-if='errors.server', :title='errors.server', type='error')

  template(#footer)
    el-button(v-if='actionType == "edit"', type='danger', @click='deleteLabel()') Удалить
    el-button(type='primary', @click='isShow = false') Закрыть
    el-button(v-if='actionType == "edit"', type='success', @click='editLabel()') Редактировать
    el-button(v-if='actionType == "create"', type='success', @click='createLabel()') Создать
</template>

<script>
export default {
  props: {
    name: {
      type: Object,
      default: () => {
        return {
          ua: '',
          ru: '',
        };
      },
    },
    color: {
      type: String,
      default: '#7952b3',
    },
    title: {
      type: String,
      default: '',
    },
    labelId: {
      type: Number,
      default: null,
    },
    ratingId: {
      type: Number,
      default: null,
    },
    actionType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      errors: {
        server: '',
        name: '',
        color: '',
      },
      success: '',
      // Показать модальное окно
      isShow: true,
      isSending: false,
      label: {
        // Название
        name: {
          ua: '',
          ru: '',
        },
        // Цвет
        color: '',
      },
      // Предлагаемые цвета
      colorsDefault: [
        '#7952b3',
        '#E94B3C',
        '#409EFF',
        '#67C23A',
        '#E6A23C',
        '#F56C6C',
        '#909399',
        '#e91e63',
        '#9c27b0',
        '#009688',
        '#357a38',
        '#4780ad',
        '#4615b2',
        '#00FF00',
        '#000000',
        '#ff9100',
        '#003C7A',
      ],
    };
  },
  mounted() {
    this.label.name = this.name;
    this.label.color = this.color;
  },
  methods: {
    // Выбрать цвет
    setColor(color) {
      this.label.color = color;
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

    // Создать ярлык
    async createLabel() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      this.$store
        .dispatch('page-rating/createLabel', {
          color: this.label.color,
          name: this.label.name,
          ratingId: this.ratingId,
        })
        .then(() => {
          this.success = 'Ярлык добавлен';
        })
        .catch((errors) => {
          this.setErrors(errors);
        })
        .finally(() => {
          this.isSending = false;
        });
    },

    // Редактировать ярлык
    async editLabel() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      this.$store
        .dispatch('page-rating/editLabel', {
          id: this.labelId,
          color: this.label.color,
          name: this.label.name,
          ratingId: this.ratingId,
        })
        .then(() => {
          this.success = 'Ярлык отредактирован';
        })
        .catch((errors) => {
          this.setErrors(errors);
        })
        .finally(() => {
          this.isSending = false;
        });
    },

    // Удалить ярлык
    async deleteLabel() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      this.$store
        .dispatch('page-rating/deleteLabel', {
          id: this.labelId,
          ratingId: this.ratingId,
        })
        .then(() => {
          this.success = 'Ярлык удалён';
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
.dialog-label-rating
  &__colors
    display: inline-flex
    align-items: center
    flex-wrap: wrap
    &-item
      border: 4px solid #fff
      height: 30px
      width: 30px
      margin: 2px
      cursor: pointer
</style>
