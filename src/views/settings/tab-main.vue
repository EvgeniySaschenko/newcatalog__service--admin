<template lang="pug">
include /src/mixins.pug

el-form.form-login(label-position='top', v-loading='isLoading')
  .u-mb--10
    el-alert(
      :title='$t(`To see the changes in the admin panel, you need to refresh the page`)',
      type='warning',
      show-icon,
      :closable='false'
    )

  el-descriptions(direction='vertical', :column='2', border)
    // Admin langs list
    el-descriptions-item
      el-form-item(
        :label='$t("List of languages of the admin panel and API server")',
        :error='errors[SettingsEnum.adminLangs]'
      )
        el-select(v-model='adminLangs', multiple, filterable)
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}

      el-tag.u-m--5(type='danger', size='small') API SERVER
      el-tag.u-m--5(type='danger', size='small') ADMIN PANEL

    el-descriptions-item(width='200', align='center')
      el-button(
        type='primary',
        @click='editLangsList({ langs: adminLangs, type: SettingsEnum.adminLangs })'
      ) {{ $t('Save') }}

    // Admin lang default
    el-descriptions-item
      el-form-item(
        :label='$t("Admin panel and API server, language by default")',
        :error='errors[SettingsEnum.adminLang]'
      )
        el-select(v-model='adminLang', filterable)
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}

      el-tag.u-m--5(type='danger', size='small') API SERVER
      el-tag.u-m--5(type='danger', size='small') ADMIN PANEL

    el-descriptions-item(align='center')
      el-button(
        type='primary',
        @click='editLangDefault({ lang: adminLang, type: SettingsEnum.adminLang })'
      ) {{ $t('Save') }}

    // Site langs list
    el-descriptions-item
      el-form-item(:label='$t("List of site languages")', :error='errors[SettingsEnum.siteLangs]')
        el-select(v-model='siteLangs', multiple, filterable)
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}

      el-tag.u-m--5(type='danger', size='small') WEBSITE
    el-descriptions-item(align='center')
      el-button(
        type='primary',
        @click='editLangsList({ langs: siteLangs, type: SettingsEnum.siteLangs })'
      ) {{ $t('Save') }}

    // Site lang default
    el-descriptions-item
      el-form-item(:label='$t("Site default language")', :error='errors[SettingsEnum.siteLang]')
        el-select(v-model='siteLang', filterable)
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}

      el-tag.u-m--5(type='danger', size='small') WEBSITE
    el-descriptions-item(align='center')
      el-button(
        type='primary',
        @click='editLangDefault({ lang: siteLang, type: SettingsEnum.siteLang })'
      ) {{ $t('S:ave') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useSettingsStore from '@/store/settings';
import {
  SettingsType,
  LangsIsoType,
  SettingsLangDefaultType,
  SettingsLangsListType,
  SettingsEnum,
} from '@/types';

export default defineComponent({
  data() {
    return {
      // Indicates that there have been some changes in the settings
      isChanges: false,
      isLoading: false,
      SettingsEnum: SettingsEnum,
      langsIso: [] as LangsIsoType[],
      adminLang: '' as SettingsType[SettingsEnum.adminLang],
      adminLangs: [] as SettingsType[SettingsEnum.adminLangs],
      siteLang: '' as SettingsType[SettingsEnum.siteLang],
      siteLangs: [] as SettingsType[SettingsEnum.siteLangs],
      errors: {
        [SettingsEnum.adminLang]: '',
        [SettingsEnum.adminLangs]: '',
        [SettingsEnum.siteLang]: '',
        [SettingsEnum.siteLangs]: '',
      },
    };
  },

  mounted() {
    this.init();
  },

  unmounted() {
    // Refresh the page so that the changes are applied to the entire admin panel
    if (this.isChanges) {
      setTimeout(() => {
        location.reload();
      }, 200);
    }
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
      this.adminLang = settings[SettingsEnum.adminLang];
      this.adminLangs = settings[SettingsEnum.adminLangs];
      this.siteLang = settings[SettingsEnum.siteLang];
      this.siteLangs = settings[SettingsEnum.siteLangs];
    },

    // Edit lang default
    async editLangDefault({ lang, type }: SettingsLangDefaultType) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [type]: '' });
      try {
        let response = await this.$api['settings'].editLangDefault({ lang, type });
        this.isChanges = true;

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Language changed'),
          });
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
    async editLangsList({ langs, type }: SettingsLangsListType) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [type]: '' });
      try {
        let response = await this.$api['settings'].editLangsList({ langs, type });
        this.isChanges = true;
        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Language list changed'),
          });
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
