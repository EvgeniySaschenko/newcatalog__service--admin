<template lang="pug">
include /src/mixins.pug
+b.page--ratings
  +e.H1.title {{ $route.name }}

// Кнопка создать рейтинг
el-button.bi.bi-plus-circle-fill(
  type="primary",
  @click="goToPageCreateRating()"
) {{ $('Создать новый рейтинг') }}

// Список рейтингов
el-table(:data="ratings", stripe)
  el-table-column(label="Название")
    template(#default="scope")
      router-link(:to="`${pathPage}/${scope.row.id}`") {{ scope.row.name.ua }}
  el-table-column(label="Дата создания", width="150")
    template(#default="scope") {{ dateFormat(scope.row.dateCreate) }}
</template>

<script>
import moment from 'moment';

export default {
  name: 'page-ratings',
  data() {
    return {
      // Путь текущей страницы
      pathPage: '',
    };
  },
  computed: {
    ratings() {
      return this.$store.state['page-ratings'].items;
    },
  },

  mounted() {
    this.setPathPage();
    this.$store.dispatch('page-ratings/getRatings');
  },
  methods: {
    // Форматировать дату
    dateFormat(dateCreate) {
      return moment.unix(dateCreate).format('DD.MM.YYYY');
    },
    // Установить значение базовй url
    setPathPage() {
      let { pathname } = location;
      if (pathname.slice(-1) == '/') {
        pathname = pathname.substring(0, pathname.length - 1);
      }
      this.pathPage = pathname;
    },
    // Перейти на страницу создания рейтинга
    goToPageCreateRating() {
      this.$router.push({ path: `${this.pathPage}/create` });
    },
  },
};
</script>

<style lang="sass" scoped></style>
