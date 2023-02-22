<template lang="pug">
include /src/mixins.pug

+b.page--img-cropper
  +e.H1.title
    +e.title-col--1
      span {{ $route.name }}&nbsp;
      span(v-if='items.length') {{ curIndex + 1 }} {{ $t('из') }} {{ items.length }}
    +e.title-col--2
      +e.EL-TAG.tag-processing-status(size='medium', :type='curItem.isSend ? "success" : ""') {{ curItem.isSend ? $t('Обработано') : $t('Не обработано') }}

      el-button(
        type='primary',
        @click='sendImg()',
        :loading='isSend',
        :disabled='isDisabledBtnSend'
      ) {{ $t('Отправить на сервер') }}

  +e.EL-ALERT.alert-send-status(
    :type='isErrorSend ? "error" : "success"',
    :closable='false',
    v-if='messageResult'
  ) {{ messageResult }}
  +e.box-arrow
    +e.I.arrow--prev.bi.bi-arrow-left-circle-fill(@click='toggleImg("prev")')
    +e.I.arrow--next.bi.bi-arrow-right-circle-fill(@click='toggleImg("next")')
  +e.name-img.text-uppercase {{ curItem.img }}
  app-img-cropper(:imgData='curItem', @img-data='setImgDataResult($event)')
</template>

<script>
import AppImgCropper from '@/components/app-img-cropper/app-img-cropper.vue';
// import { ArrowRight, ArrowLeft } from '@element-plus/icons';

export default {
  components: {
    AppImgCropper,
    // ArrowRight,
    // ArrowLeft,
  },
  data() {
    return {
      items: [],
      curIndex: 0,
      isSend: false,
      curItem: {
        // isSend: false,
        // imgBase64: "",
        // color: "",
      },
      messageResult: '',
      isErrorSend: false,
    };
  },
  computed: {
    isDisabledBtnSend() {
      return !this.curItem.imgBase64 || !this.curItem.color;
    },
  },

  async mounted() {
    this.items = await this.getRawImg();

    this.items = [
      {
        img: require('@/assets/img/0.jpg'),
      },
      {
        img: require('@/assets/img/1.jpg'),
      },
      {
        img: require('@/assets/img/2.jpg'),
      },
      {
        img: require('@/assets/img/3.jpg'),
      },
    ];
    this.setCurImg();
  },

  methods: {
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
    // Получить необработанные картинки с сервера
    async getRawImg() {
      let response;
      try {
        response = await this.axios.get('/api/site/screen');
      } catch (error) {
        console.log(error);
      }
      return response;
    },
    // Если изображение обработано, устанавливаем флаг
    setImgDataResult({ imgBase64, color }) {
      if (imgBase64) {
        this.curItem.imgBase64 = imgBase64;
      }
      if (color) {
        this.curItem.color = color;
      }
    },
    // Переключение слайдов
    toggleImg(direction) {
      this.messageResult = '';
      this.isErrorSend = false;
      this.curItem = {};
      this.setCurImg(direction);
    },
    // Отправить изображение на сервер
    async sendImg() {
      let { imgBase64, color } = this.curItem;
      if (this.isSend || !color || !imgBase64) return;
      this.isSend = true;
      let response;
      let curIndex = this.curIndex;
      try {
        response = await this.axios({
          method: 'post',
          url: '/api/site/logo/',
          data: this.items[curIndex],
        });

        Object.assign(this.items[curIndex], {
          imgBase64,
          color,
          isSend: true,
        });
        this.messageResult = this.$t('Сообщение отправлено');
      } catch (error) {
        this.messageResult = this.$t('Ошибка сервера');
        this.isErrorSend = true;
        console.log(error);
      } finally {
        this.isSend = false;
      }
      return response;
    },
  },
};
</script>

<style lang="sass" scoped>
.page
  &__title
    display: flex
    justify-content: space-between
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
