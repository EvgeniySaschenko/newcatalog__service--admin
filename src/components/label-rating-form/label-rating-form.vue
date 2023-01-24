<template lang="pug">
include /src/mixins.pug

+b.EL-FORM.label-rating-form(label-position='top', :inline='true')
  el-form-item(label='Название')
    el-input(placeholder='Название', v-model='label.name', required, :maxlength='nameMaxLength')
  el-form-item(label='Цвет ярлыка')
    +e.colors
      +e.colors-item(
        v-for='item in colorsDefault',
        :style='{ backgroundColor: item, borderColor: label.color == item ? label.color : "#fff" }',
        :key='item',
        @click='setColor(item)'
      )
      el-color-picker(v-model='label.color')
  el-form-item(label='Ярлык')
    .label-rating(:style='{ backgroundColor: label.color }') {{ label.name }}
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Текст ярлыка',
    },
    color: {
      type: String,
      default: '#7952b3',
    },
  },
  data() {
    return {
      label: {
        // Название
        name: '',
        // Цвет
        color: '',
      },
      // Максимальная длина текста ярлыка
      nameMaxLength: 20,
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
        '#4aedc4',
        '#ff9100',
        '#33eb91',
      ],
    };
  },
  mounted() {
    this.label.name = this.name;
    this.label.color = this.color;
  },
  watch: {
    label: {
      deep: true,
      immediate: true,
      handler() {
        this.emitChange();
      },
    },
  },
  methods: {
    // Выбрать цвет
    setColor(color) {
      this.label.color = color;
    },
    // При изменениях передаём объект
    emitChange() {
      this.$emit('change', this.label);
    },
  },
};
</script>

<style lang="sass" scoped>
.label-rating-form
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
