<template lang="pug">
include /src/mixins.pug

+b.app-preloader-page
  +e.box
    +e.text {{ $t('Access to the API server is temporarily blocked, please refresh the page later') }}
    +e.btn
      el-button(type='warning', @click='reloadPage()') {{ $t('Reload page') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    reloadPage() {
      window.location.reload();
    },
  },
});
</script>

<style lang="sass" scoped>
@keyframes preloader-animate
  0%
    opacity: .7
    background-color: var(--app-color-primary)
  20%
    opacity: .8
    background-color: var(--app-color-primary)
  50%
    opacity: .9
    background-color: var(--app-color-primary)
  70%
    opacity: .8
    background-color: var(--app-color-primary)
  100%
    opacity: .7
    background-color: var(--app-color-primary)

.app-preloader-page
  z-index: 1000
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  text-align: center
  display: flex
  justify-content: center
  align-items: center
  background-color: #fff
  &::before
    content: ""
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0
    animation: preloader-animate 8s ease-in-out infinite
  &__box
    position: relative
    z-index: 1
  &__text
    padding: 10px
    font-size: 24px
    color: #fff
</style>
