<template lang="pug">
include /src/mixins.pug
.app-language-swich
  el-select(v-model='langDefault', @change='setLangDefault()')
    el-option(v-for='item in langsAdmin', :key='item', :label='item', :value='item')
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'language-swich',
  data() {
    return {
      langDefault: this.$langDefault('admin'),
      langsAdmin: Object.keys(this.$langs('admin')),
    };
  },

  methods: {
    // Set lang default
    setLangDefault() {
      this.$setCokieLangDefault({ langDefault: this.langDefault });
      location.reload();
    },
  },
});
</script>

<style lang="sass" scoped>
.app-language-swich
  width: 60px
</style>
