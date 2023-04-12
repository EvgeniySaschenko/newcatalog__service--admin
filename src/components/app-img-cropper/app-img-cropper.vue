<template lang="pug">
include /src/mixins.pug
+b.img-cropper
  vue-cropper(
    :img='img',
    :outputSize='outputSize',
    :canMove='isCanMove',
    :autoCropWidth='autoCropWidth',
    :autoCropHeight='autoCropHeight',
    :fixedNumber='fixedNumber',
    :autoCrop='isAutoCrop',
    :centerBox='isCenterBox',
    :original='true',
    ref='cropper',
    :style='{ height: heightImgCropper }'
  )

  +e.EL-BUTTON.btn-crop-canvas-img(type='primary', @click='cropCanvasImg()') {{ $t('Crop') }}
  app-img-color(
    :imgData='{ img: imgBase64, color: color }',
    @update:img-data='emitImgData($event)'
  )
</template>

<script lang="ts">
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import AppImgColor from '@/components/app-img-color/app-img-color.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['update:img-data'],
  props: {
    img: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
  },

  watch: {
    img: {
      handler() {
        this.imgBase64 = '';
      },
    },
  },
  components: {
    VueCropper,
    AppImgColor,
  },

  data() {
    return {
      // Params the plugin
      isAutoCrop: true,
      isCenterBox: true,
      isCanMove: true,
      original: true,
      outputSize: 0.5,
      autoCropWidth: 250,
      autoCropHeight: 80,
      fixedNumber: [1, 0.36],
      // Custom params
      heightImgCropper: '500px',
      canvasHeight: 10,
      canvasWidth: 10,
      imgBase64: '',
    };
  },

  methods: {
    // Crop canvas img
    cropCanvasImg() {
      (this.$refs.cropper as any).getCropData((imgBase64: string) => {
        this.imgBase64 = imgBase64;
      });
    },

    emitImgData($event: { color: string }) {
      this.$emit('update:img-data', {
        params: this.calcCanvasImgParams(),
        color: $event.color,
        imgBase64: this.imgBase64,
      });
    },

    // Calc coordinates and sizes
    calcCanvasImgParams() {
      let imgAxis = (this.$refs.cropper as any).getImgAxis();
      let cropAxis = (this.$refs.cropper as any).getCropAxis();

      return {
        top: Math.round(Math.abs(imgAxis.y1 - cropAxis.y1)),
        left: Math.round(Math.abs(imgAxis.x1 - cropAxis.x1)),
        cutWidth: Math.round(Math.abs(cropAxis.x2 - cropAxis.x1)),
        cutHeight: Math.round(Math.abs(cropAxis.y2 - cropAxis.y1)),
        imgWidth: Math.round(Math.abs(imgAxis.x2 - imgAxis.x1)),
        imgHeight: Math.round(Math.abs(imgAxis.y2 - imgAxis.y1)),
      };
    },
  },
});
</script>

<style lang="sass">
.img-cropper
  &__bg-logo
    height: 30px
    width: 30px
    border: 1px solid #000
  &__btn-crop-canvas-img
    margin: 10px 0 !important
  &__box-canvas
    padding: 10px
    display: inline-flex
</style>
