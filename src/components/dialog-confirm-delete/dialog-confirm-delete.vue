<template lang="pug">
include /src/mixins.pug
el-dialog(v-model='isShow', title='Подтвердите удаление')
  template(#footer)
    el-button(type='primary', @click='cancel()') Закрыть
    el-button(type='danger', @click='confirm()') Удалить
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      promiseResolve: null,
    };
  },
  methods: {
    show() {
      this.isShow = true;
      this.promise;

      return new Promise((resolve) => {
        this.promiseResolve = resolve;
      });
    },

    confirm() {
      this.isShow = false;
      this.promiseResolve(true);
    },

    cancel() {
      this.isShow = false;
      this.promiseResolve(false);
    },
  },
};
</script>

<style lang="sass"></style>
