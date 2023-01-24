<template lang="pug">
include /src/mixins.pug
+b.img-cropper
  vue-cropper(
    :img='imgData.img',
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

  +e.EL-BUTTON.btn-crop-canvas-img(type='primary', @click='cropCanvasImg()') Обрезать

  el-form(label-width='100px')
    el-form-item(label='Цвет')
      +e.bg-logo(:style='{ backgroundColor: color }') 
    el-form-item(label='Превью')
      +e.box-canvas(:style='{ backgroundColor: color }')
        +e.CANVAS.canvas(
          ref='canvas',
          @click='getCanvasColor($event)',
          :height='canvasHeight',
          :width='canvasWidth'
        )
</template>

<script>
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';

export default {
  props: {
    imgData: {
      type: Object,
      default: () => {
        return {
          img: '',
          params: '',
          imgBase64: '',
        };
      },
    },
  },
  components: {
    VueCropper,
  },

  data() {
    return {
      // Параметры плагина
      isAutoCrop: true,
      isCenterBox: true,
      isCanMove: true,
      original: true,
      outputSize: 0.5,
      autoCropWidth: 250,
      autoCropHeight: 80,
      fixedNumber: [1, 0.36],
      // Мои
      heightImgCropper: '500px',
      color: 'transparent',
      canvasHeight: 10,
      canvasWidth: 10,
    };
  },

  watch: {
    imgData: {
      handler() {
        let { params, color, imgBase64 } = this.imgData;
        this.addCanvasImg(imgBase64 || '');
        this.color = color || 'transparent';
        this.params = params || '';
      },
    },
  },
  methods: {
    // Обрезать изображение
    addCanvasImg(data) {
      let { canvas } = this.$refs;
      let ctx = canvas.getContext('2d');
      let img = document.createElement('img');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      img.src = data;

      img.addEventListener('load', () => {
        this.canvasHeight = img.height;
        this.canvasWidth = img.width;
        this.$nextTick(() => {
          ctx.drawImage(img, 0, 0, img.width, img.height);
        });
      });
    },
    // Добавить изображение в canvas
    cropCanvasImg() {
      this.$refs.cropper.getCropData((data) => {
        this.addCanvasImg(data);
        this.setCanvasImgParams();
        this.$emit('img-data', {
          params: this.params,
          imgBase64: data,
        });
      });
    },
    // Кординаты / размеры
    setCanvasImgParams() {
      let imgAxis = this.$refs.cropper.getImgAxis();
      let cropAxis = this.$refs.cropper.getCropAxis();

      this.params = {
        top: Math.round(Math.abs(imgAxis.y1 - cropAxis.y1)),
        left: Math.round(Math.abs(imgAxis.x1 - cropAxis.x1)),
        cutWidth: Math.round(Math.abs(cropAxis.x2 - cropAxis.x1)),
        cutHeight: Math.round(Math.abs(cropAxis.y2 - cropAxis.y1)),
        imgWidth: Math.round(Math.abs(imgAxis.x2 - imgAxis.x1)),
        imgHeight: Math.round(Math.abs(imgAxis.y2 - imgAxis.y1)),
      };
    },
    // Получить цвет пинселя canvas
    getCanvasColor(event) {
      let { canvas } = this.$refs;
      let bounds = event.target.getBoundingClientRect();
      let x = event.clientX - bounds.left;
      let y = event.clientY - bounds.top;
      let pxData = canvas.getContext('2d').getImageData(x, y, 1, 1);
      this.color = 'rgb(' + pxData.data[0] + ',' + pxData.data[1] + ',' + pxData.data[2] + ')';
      this.$emit('img-data', {
        color: this.color,
      });
    },
  },
};
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
