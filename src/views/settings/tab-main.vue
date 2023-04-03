<template lang="pug">
include /src/mixins.pug

el-form.form-login(label-position='top', v-loading='isLoading')
  el-descriptions(direction='vertical', :column='2', border)
    // Admin langs list
    el-descriptions-item
      el-form-item(
        :label='$t("List of languages of the admin panel")',
        :error='errors["admin-langs"]'
      )
        el-select(v-model='adminLangs', multiple)
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}
    el-descriptions-item(width='200', align='center')
      el-button(
        type='primary',
        @click='editLangsList({ langs: adminLangs, name: settingsNames.adminLangs })'
      ) {{ $t('Save') }}

    // Admin lang default
    el-descriptions-item
      el-form-item(
        :label='$t("Admin panel language by default")',
        :error='errors["admin-lang-default"]'
      )
        el-select(v-model='adminLangDefault')
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}
    el-descriptions-item(align='center')
      el-button(
        type='primary',
        @click='editLangDefault({ lang: adminLangDefault, name: settingsNames.adminLangDefault })'
      ) {{ $t('Save') }}

    // Site langs list
    el-descriptions-item
      el-form-item(:label='$t("List of site languages")', :error='errors["site-langs"]')
        el-select(v-model='siteLangs', multiple)
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}
    el-descriptions-item(align='center')
      el-button(
        type='primary',
        @click='editLangsList({ langs: siteLangs, name: settingsNames.siteLangs })'
      ) {{ $t('Save') }}

    // Site lang default
    el-descriptions-item
      el-form-item(:label='$t("Site default language")', :error='errors["site-lang-default"]')
        el-select(v-model='siteLangDefault')
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}
    el-descriptions-item(align='center')
      el-button(
        type='primary',
        @click='editLangDefault({ lang: siteLangDefault, name: settingsNames.siteLangDefault })'
      ) {{ $t('Save') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useSettingsStore from '@/store/settings';
import {
  SettingsType,
  LangsIsoType,
  SettingsLangDefaultType,
  SettingsLangsListType,
} from '@/types';

export default defineComponent({
  data() {
    return {
      isLoading: false,
      settingsNames: {
        adminLangDefault: 'admin-lang-default',
        adminLangs: 'admin-langs',
        siteLangDefault: 'site-lang-default',
        siteLangs: 'site-langs',
      },
      langsIso: [] as LangsIsoType[],
      adminLangDefault: '' as SettingsType['admin-lang-default'],
      adminLangs: [] as SettingsType['admin-langs'],
      siteLangDefault: '' as SettingsType['site-lang-default'],
      siteLangs: [] as SettingsType['site-langs'],
      errors: {
        'admin-lang-default': '',
        'admin-langs': '',
        'site-lang-default': '',
        'site-langs': '',
      },
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      let {
        langsIso,
        settings,
      }: {
        langsIso: LangsIsoType[];
        settings: SettingsType;
      } = JSON.parse(JSON.stringify(useSettingsStore().settings));

      this.langsIso = langsIso;
      this.adminLangDefault = settings['admin-lang-default'];
      this.adminLangs = settings['admin-langs'];
      this.siteLangDefault = settings['site-lang-default'];
      this.siteLangs = settings['site-langs'];
    },

    // Edit lang default
    async editLangDefault({ lang, name }: SettingsLangDefaultType) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [name]: '' });
      try {
        let response = await this.$api.settings.editLangDefault({ lang, name });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Language changed'),
          });
          return;
        }
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        if (errors.errors) {
          this.$utils.setErrors(this.errors, errors.errors);
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Edit lang default
    async editLangsList({ langs, name }: SettingsLangsListType) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [name]: '' });
      try {
        let response = await this.$api.settings.editLangsList({ langs, name });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Language list changed'),
          });
          return;
        }
      } catch (errors: any) {
        if (errors.server) {
          this.$utils.showMessageError({ message: errors.server });
          return;
        }
        if (errors.errors) {
          this.$utils.setErrors(this.errors, errors.errors);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
