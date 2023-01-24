<template lang="pug">
include /src/mixins.pug

+b.EL-FORM.tab-images(v-loading='isSending')
  +e.title(ref='title')
    +e.title-col--1
      span {{ $route.name }}&nbsp;
      span(v-if='items.length') {{ curIndex + 1 }} {{ "из" }} {{ items.length }}
    +e.title-col--2
      +e.EL-TAG.tag-processing-status(size='medium', :type='curItem.isSend ? "success" : ""') {{ curItem.isSend ? "Обработано" : "Не обработано" }}

      el-button(type='primary', @click='sendImg()') {{ "Отправить на сервер" }}

  el-alert(v-if='messages.serverSuccess', :title='messages.serverSuccess', type='success')
  el-alert(v-if='messages.imgError', :title='messages.imgError', type='error')
  el-alert(v-if='messages.colorError', :title='messages.colorError', type='error')
  el-alert(v-if='messages.serverError', :title='messages.serverError', type='error')
  +e.box-arrow
    +e.I.arrow--prev.bi.bi-arrow-left-circle-fill(@click='toggleImg("prev")')
    +e.I.arrow--next.bi.bi-arrow-right-circle-fill(@click='toggleImg("next")')
  +e.name-img.text-uppercase {{ curItem.img }}
  img-cropper(:imgData='curItem', @img-data='setImgDataResult($event)')
</template>

<script>
import ImgCropper from '@/components/img-cropper/img-cropper.vue';

export default {
  components: {
    ImgCropper,
  },
  props: {
    rating: {
      type: Object,
    },
  },

  watch: {
    rating: {
      immediate: true,
      deep: true,
      handler() {
        this.preparationData();
        this.setCurImg();
      },
    },
  },

  data() {
    return {
      items: [],
      curIndex: 0,
      isSending: false,
      curItem: {
        isSend: false,
        color: '',
        params: null,
      },
      messages: {
        imgError: '',
        colorError: '',
        serverError: '',
        serverSuccess: '',
      },
    };
  },

  async mounted() {
    await this.init();
  },

  methods: {
    async init() {
      await this.$store.dispatch('page-rating/getSitesSreens', {
        ratingId: this.rating.id,
      });
    },

    // Подготовка данных
    preparationData() {
      let { screensSites } = this.rating;
      this.items = [...screensSites];
    },
    // Установить текущую картинку
    setCurImg(direction) {
      if (!this.items.length) return;
      switch (direction) {
        case 'next': {
          let maxIndex = this.items.length - 1;
          this.curIndex = this.curIndex + 1 <= maxIndex ? this.curIndex + 1 : maxIndex;
          break;
        }
        case 'prev': {
          this.curIndex = this.curIndex - 1 >= 0 ? this.curIndex - 1 : 0;
          break;
        }
        default:
          this.curIndex = 0;
      }
      this.curItem = { ...this.items[this.curIndex] };
    },
    // Если изображение обработано, устанавливаем флаг
    setImgDataResult({ params, color, imgBase64 }) {
      if (params) {
        this.curItem.params = params;
        this.curItem.imgBase64 = imgBase64;
      }
      if (color) {
        this.curItem.color = color;
      }
    },
    // Переключение слайдов
    toggleImg(direction) {
      this.clearMessages();
      this.curItem = {};
      this.setCurImg(direction);
    },
    // Очистить сообщения
    clearMessages() {
      for (let item in this.messages) {
        this.messages[item] = '';
      }
    },
    // Установить сообщения
    setMessages(messages) {
      Object.assign(this.messages, messages);
    },
    // Отправить изображение на сервер
    async sendImg() {
      this.clearMessages();
      let { params, color, imgBase64, id } = this.curItem;
      if (this.isSending) return;
      this.isSending = true;

      try {
        await this.$store.dispatch('page-rating/createSiteLogo', {
          params,
          color,
          id,
          ratingId: this.rating.id,
        });

        this.curItem.isSend = true;
        this.items[this.curIndex] = {
          isSend: true,
          params,
          color,
          imgBase64,
        };
      } catch (error) {
        this.messages.serverError = 'Ошибка сервера';
      } finally {
        this.isSending = false;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.tab-images
  &__title
    display: flex
    justify-content: space-between
    padding: 10px
  &__box-arrow
    justify-content: space-between
  &__box-arrow
    display: flex
    justify-content: space-between
  &__arrow
    font-size: 25px
    cursor: pointer
  &__tag-processing-status
    margin-right: 10px
  &__alert-send-status
    margin-bottom: 10px
</style>
