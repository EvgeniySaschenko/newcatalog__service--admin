<template lang="pug">
include /src/mixins.pug
+b.app-img-color
  +e.col
    +e.title {{ $t('Цвет') }}
    +e.value
      el-color-picker(v-model='color', size='large', @change='setColor()')
  +e.col
    +e.title {{ $t('Превью') }}
    +e.value
      +e.preview-box-canvas(:style='{ backgroundColor: color }')
        +e.CANVAS.canvas(
          ref='canvas',
          @click='getCanvasColor($event)',
          :height='canvasHeight',
          :width='canvasWidth'
        )
</template>

<script>
import rgb2hex from 'rgb2hex';
import { defineComponent } from 'vue';

export default defineComponent({
  model: {
    prop: 'imgData',
    event: 'update',
  },
  props: {
    imgData: {
      type: Object,
      default: () => {
        return {
          img: '',
          color: '#ffffff',
        };
      },
    },
  },

  data() {
    return {
      color: '',
      canvasHeight: 10,
      canvasWidth: 10,
    };
  },

  watch: {
    imgData: {
      deep: true,
      handler() {
        if (!this.imgData.img) {
          this.clearCanvas();
          return;
        }
        this.setCanvasData();
      },
    },
  },

  mounted() {
    this.setCanvasData();
  },

  methods: {
    // Crop image
    addCanvasImg(img) {
      let { canvas } = this.$refs;
      let ctx = canvas.getContext('2d');
      let elementImg = document.createElement('img');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elementImg.src = img;

      elementImg.addEventListener('load', () => {
        let { height, width } = elementImg;
        this.canvasHeight = height;
        this.canvasWidth = width;
        this.$nextTick(() => {
          ctx.drawImage(elementImg, 0, 0, width, height);
        });
      });
    },

    // Сlear сanvas
    clearCanvas() {
      this.canvasWidth = 10;
      this.canvasHeight = 10;
      this.color = '';
      this.$refs.canvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    // Add image / color to canvas
    setCanvasData() {
      let { color, img } = this.imgData;
      this.color = color || '#ffffff';
      this.addCanvasImg(img || '');
    },

    // Gets the color of the clicked pixel
    getCanvasColor(event) {
      let { canvas } = this.$refs;
      let bounds = event.target.getBoundingClientRect();
      let x = event.clientX - bounds.left;
      let y = event.clientY - bounds.top;
      let [red, green, blue] = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      this.color = rgb2hex(`rgb(${red},${green},${blue})`).hex;
      this.$emit('update:img-data', {
        color: this.color,
        img: this.imgData.img,
      });
    },

    setColor() {
      this.$emit('update:img-data', {
        color: this.color,
        img: this.imgData.img,
      });
    },
  },
});
</script>

<style lang="sass" scoped>
.app-img-color
  display: flex
  &__title
    padding: 5px 10px
    font-weight: bold
  &__value
    padding: 10px
  &__color-bg
    height: 30px
    width: 30px
  &__preview-box-canvas
    display: flex
    padding: 10px
    border: 1px solid var(--app-border-color)
</style>
