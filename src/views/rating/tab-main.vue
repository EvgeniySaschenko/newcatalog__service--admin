<template lang="pug">
include /src/assets/pug/index.pug

el-form(v-loading="isSending", label-position="left", label-width="150px")
  // Разделы 
  el-form-item(:error="errors.sectionsIds", label="Разделы", required)
    el-select(
      multiple,
      filterable,
      allow-create,
      :multiple-limit="sectionsIdsLimit",
      default-first-option,
      v-model="state.sectionsIds",
      placeholder="Разделы"
    )
      el-option(v-for="item in sections", :key="item.id", :label="item.name.ua", :value="item.id")
  // Тип рейтинга
  el-form-item(label="Тип рейтинга")
    el-radio-group(v-model="state.typeRating")
      el-radio-button(label="site", size="small") Сайты
  // Отображение
  el-form-item(label="Отображение")
    el-radio-group(v-model="state.typeDisplay")
      el-radio-button(label="tile", size="small") Плитка
      el-radio-button(label="inline", size="small") Линия
  // Упорядочить контент по
  el-form-item(label="Упорядочить контент по:")
    el-radio-group(v-model="state.typeSort")
      el-radio-button(label="alexa", size="small") Alexa Rank
      el-radio-button(label="click", size="small") Кликам на ссылку
  // Название
  el-form-item(:error="errors.name", label="Название ua", required)
    el-input(v-model="state.name.ua", placeholder="Название", :maxlength="nameMaxLength") 
  el-form-item(:error="errors.name", label="Название ru", required)
    el-input(v-model="state.name.ru", placeholder="Название", :maxlength="nameMaxLength") 
  // Описание
  el-form-item(:error="errors.descr", label="Описание ua")
    el-input(
      show-word-limit,
      v-model="state.descr.ua",
      placeholder="Описание",
      type="textarea",
      :maxlength="descrMaxLength"
    )
  el-form-item(:error="errors.descr", label="Описание ru")
    el-input(
      show-word-limit,
      v-model="state.descr.ru",
      placeholder="Описание",
      type="textarea",
      :maxlength="descrMaxLength"
    )

  el-form-item(label="Скрыть")
    el-checkbox(v-model="state.isHiden")

  el-alert(v-if="success", :title="success", type="success")
  el-alert(v-if="errors.server", :title="errors.server", type="error")

  el-button(v-if="!rating.id", type="primary", @click="сreateRating()") Создать рейтинг
  el-button(v-else, type="primary", @click="editRating()") Редактировать рейтинг
</template>

<script>
import _lib from '@/plugins/_lib';

export default {
  data() {
    return {
      stateDefault: () => ({
        id: null,
        // Выбранные разделы
        sectionsIds: [],
        // Название рейтинга
        name: {},
        // Описание рейтинга
        descr: {},
        // Скрыть рейтинг
        isHiden: true,
        // Тип рейтинга
        typeRating: 'site',
        // Отображать "плиткой" / "списком"
        typeDisplay: 'tile',
        // Порядок вывода елементов рейтинга
        typeSort: 'alexa',
      }),
      state: {},
      // Максимьное количество разделов
      sectionsIdsLimit: 3,
      // Максимальное количество символов
      nameMaxLength: 150,
      // Минимальное количество символов
      nameMinLength: 15,
      // Максимальная длина описания
      descrMaxLength: 1000,
      // Указывает на то что данные отправляются
      isSending: false,
      // Сообщения
      errors: {
        name: '',
        descr: '',
        server: '',
        sectionsIds: '',
      },
      success: '',
    };
  },
  computed: {
    // Разделы сайта
    sections() {
      let { items } = this.$store.state.sections;
      return items.filter((el) => el.isHiden === false);
    },

    // Рейтинг
    rating() {
      return this.$store.state['page-rating'];
    },
  },
  watch: {
    rating: {
      immediate: true,
      deep: true,
      handler() {
        let { id } = this.rating;
        let stateDefault = this.stateDefault();
        if (id) {
          // Если рейтинг существует
          for (let item in stateDefault) {
            if (item === 'sectionsIds') {
              this.state[item] = _lib.transformObjToArray(this.rating[item]);
            } else {
              this.state[item] = this.rating[item];
            }
          }
        } else {
          // Создание нового рейтинга
          this.state = stateDefault;
        }
      },
    },
  },
  methods: {
    // Очистить ошибки
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

    // Перейти на страницу рейтига после создания
    goToPageRating(ratingId) {
      this.$router.push({ path: `/ratings/${ratingId}` });
    },

    // Создать новый рейтинг
    async сreateRating() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      let data = { ...this.state, sectionsIds: _lib.transformArrToObject(this.state.sectionsIds) };
      this.$store
        .dispatch('page-rating/createRating', data)
        .then(({ id }) => {
          this.success = 'Рейтинг создан';
          this.goToPageRating(id);
        })
        .catch((errors) => {
          this.setErrors(errors);
        })
        .finally(() => {
          this.isSending = false;
        });
    },

    // Редактировать рейтинг
    async editRating() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      let data = { ...this.state, sectionsIds: _lib.transformArrToObject(this.state.sectionsIds) };
      this.$store
        .dispatch('page-rating/editRating', data)
        .then(() => {
          this.success = 'Изменения внесены';
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

<style lang="sass" scoped></style>
