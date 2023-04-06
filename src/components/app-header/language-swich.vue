<template lang="pug">
include /src/mixins.pug
.app-language-swich
  el-select(v-model='adminLang', @change='setLangDefault()')
    el-option(v-for='item in adminLangs', :key='item', :label='item', :value='item')
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'language-swich',
  data() {
    return {
      adminLang: this.$langDefault('admin'),
      adminLangs: Object.keys(this.$langs('admin')),
    };
  },

  methods: {
    setLangDefault() {
      this.$setCokieLangDefaultLocalAdmin({ lang: this.adminLang });
      location.reload();
    },
  },
});
</script>

<style lang="sass" scoped>
.app-language-swich
  width: 60px
</style>
