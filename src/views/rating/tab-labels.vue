<template lang="pug">
include /src/mixins.pug

// Добавить ярлык
app-dialog-label-rating(
  v-if='isShowDialogLabelAdd',
  actionType='create',
  :ratingId='rating.id',
  title='Добавить ярлык',
  @closed='isShowDialogLabelAdd = false',
  @send-form='sendForm($event)'
)
el-button(type='primary')(@click='isShowDialogLabelAdd = true') Добавить ярлык

// Редактировать ярлык
app-dialog-label-rating(
  v-if='labelCurrent',
  actionType='edit',
  :color='labelCurrent.color',
  :name='labelCurrent.name',
  :labelId='labelCurrent.id',
  :ratingId='rating.id',
  title='Редактировать ярлык',
  @closed='labelCurrent = null',
  @send-form='sendForm($event)'
)

// Список ярлыков
el-table(:data='rating.labels')
  el-table-column(label='Ярлык')
    template(#default='scope')
      .label-rating(:style='{ backgroundColor: scope.row.color }') {{ scope.row.name.ua }}
      .label-rating(:style='{ backgroundColor: scope.row.color }') {{ scope.row.name.ru }}
  el-table-column(label='Редактировать', fixed='right', width='180')
    template(#default='scope')
      el-button(type='primary', @click='labelCurrent = { ...scope.row }', size='small') Редактировать
</template>

<script>
import DialogLabelRating from './dialog-label-rating.vue';

export default {
  watch: {
    rating: {
      deep: true,
      immediate: true,
      handler() {
        // this.createState();
      },
    },
  },
  computed: {
    rating() {
      return this.$store.state['page-rating'];
    },
  },
  data() {
    return {
      // Показать диалоговое окно для добавления ярлыка
      isShowDialogLabelAdd: false,
      // Текущий ярлык
      labelCurrent: null,
    };
  },
  components: {
    AppDialogLabelRating: DialogLabelRating,
  },
};
</script>

<style lang="sass" scoped></style>
