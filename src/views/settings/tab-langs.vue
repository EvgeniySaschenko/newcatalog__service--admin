<template lang="pug">
include /src/mixins.pug

el-form.form-login(label-position='top', v-loading='isLoading')
  .u-mb--10
    el-alert(
      :title='$t("To see the changes in the admin panel, you need to refresh the page.")',
      type='warning',
      show-icon,
      :closable='false'
    )

  .u-mb--10
    el-alert(
      :title='$t("Sites will be displayed in the language you selected in the language switcher.")',
      type='info',
      show-icon,
      :closable='false'
    )
  //
  .u-mb--10
    el-alert(
      :title='`${$t("Texts for the main site, in the admin panel will be displayed in the default language for the main site.")} ${$t("For example rating name or label text will be displayed in the main sat language.")}`',
      type='info',
      show-icon,
      :closable='false'
    )

  el-descriptions(direction='vertical', :column='2', border)
    // Admin + API langs
    el-descriptions-item
      el-form-item(
        :label='$t("List of languages of the admin panel and API server")',
        :error='errors[ErrorsKeys.langsAdmin] || errors[ErrorsKeys.langsApi]'
      )
        el-select(v-model='langsAdminAndApi', multiple, filterable, size='large')
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}

      el-tag.u-m--5(type='danger', size='small') API
      el-tag.u-m--5(type='danger', size='small') ADMIN

    el-descriptions-item(width='200', align='center')
      el-button(type='primary', @click='editLangs(SendTypeEnum.adminAndApi)') {{ $t('Save') }}

    // Admin + API lang default
    el-descriptions-item
      el-form-item(
        :label='$t("Admin panel and API server, language by default")',
        :error='errors[ErrorsKeys.langDefaultAdmin] || errors[ErrorsKeys.langDefaultApi]'
      )
        el-select(v-model='langDefaultAdminAndApi', filterable, size='large')
          el-option(
            v-for='item in langsIso',
            :key='item.code',
            :label='item.name',
            :value='item.code'
          )
            b [{{ item.code }}] &nbsp;
            span {{ item.name }}

      el-tag.u-m--5(type='danger', size='small') API
      el-tag.u-m--5(type='danger', size='small') ADMIN

    el-descriptions-item(align='center')
      el-button(type='primary', @click='editLangDefault(SendTypeEnum.adminAndApi)') {{ $t('Save') }}

    // Site langs
    el-descriptions-item
      el-form-item(:label='$t("List of site languages")', :error='errors[ErrorsKeys.langsSite]')
        el-select(v-model='langsSite', multiple, filterable, size='large')
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
      el-button(type='primary', @click='editLangs(SendTypeEnum.site)') {{ $t('Save') }}

    // Site lang default
    el-descriptions-item
      el-form-item(
        :label='$t("Site default language")',
        :error='errors[ErrorsKeys.langDefaultSite]'
      )
        el-select(v-model='langDefaultSite', filterable, size='large')
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
      el-button(type='primary', @click='editLangDefault(SendTypeEnum.site)') {{ $t('S:ave') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

enum SendTypeEnum {
  site = 'site',
  adminAndApi = 'adminAndApi',
}

import {
  SettingsType,
  LangsIsoType,
  SettingsEnum,
  ServicesLangsEnum,
  SettingsServicesType,
} from '@/types';

let ErrorsKeys = {
  langDefaultAdmin: `${ServicesLangsEnum.admin}--${SettingsEnum.langDefault}`,
  langDefaultSite: `${ServicesLangsEnum.site}--${SettingsEnum.langDefault}`,
  langDefaultApi: `${ServicesLangsEnum.api}--${SettingsEnum.langDefault}`,
  langsAdmin: `${ServicesLangsEnum.admin}--${SettingsEnum.langs}`,
  langsSite: `${ServicesLangsEnum.site}--${SettingsEnum.langs}`,
  langsApi: `${ServicesLangsEnum.api}--${SettingsEnum.langs}`,
};

export default defineComponent({
  data() {
    return {
      // Indicates that there have been some changes in the settings
      isChanges: false,
      isLoading: false,
      SettingsEnum: SettingsEnum,
      ServicesLangsEnum: ServicesLangsEnum,
      langsIso: [] as LangsIsoType[],
      // !!! For services "admin" and "api", used  lang "admin"
      langDefaultAdminAndApi: '' as
        | SettingsType['langDefault']['admin']
        | SettingsType['langDefault']['api'],
      // !!! For services "admin" and "api", used  lang "admin"
      langsAdminAndApi: [] as SettingsType['langs']['admin'] | SettingsType['langs']['api'],
      langDefaultSite: '' as SettingsType['langDefault']['site'],
      langsSite: [] as SettingsType['langs']['site'],
      errors: {
        [ErrorsKeys.langDefaultAdmin]: '',
        [ErrorsKeys.langDefaultSite]: '',
        [ErrorsKeys.langDefaultApi]: '',
        [ErrorsKeys.langsAdmin]: '',
        [ErrorsKeys.langsSite]: '',
        [ErrorsKeys.langsApi]: '',
      },
      ErrorsKeys,
      SendTypeEnum,
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
    // Init
    async init() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        let { langsIso, settings } = await this.$api['settings'].getSettings();
        this.langsIso = langsIso;
        this.langDefaultAdminAndApi = settings['langDefault'].admin;
        this.langsAdminAndApi = settings['langs'].admin;
        this.langDefaultSite = settings['langDefault'].site;
        this.langsSite = settings['langs'].site;
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Edit lang default
    async editLangDefault(type: keyof typeof SendTypeEnum) {
      if (this.isLoading) return;
      this.isLoading = true;
      let langDefault: SettingsServicesType['langDefault']['settingValue'];
      let servicesNames: SettingsServicesType['langDefault']['servicesNames'];
      let errorsClear: Record<string, string>;

      switch (type) {
        case SendTypeEnum.site:
          langDefault = this.langDefaultSite;
          servicesNames = [ServicesLangsEnum.site];
          errorsClear = { [ErrorsKeys.langDefaultSite]: '' };
          break;
        case SendTypeEnum.adminAndApi:
          langDefault = this.langDefaultAdminAndApi;
          servicesNames = [ServicesLangsEnum.admin, ServicesLangsEnum.api];
          errorsClear = { [ErrorsKeys.langDefaultAdmin]: '', [ErrorsKeys.langDefaultApi]: '' };
          break;
        default:
          return;
      }

      this.$utils.clearErrors(this.errors, errorsClear);
      try {
        let response = await this.$api['settings'].editSetting({
          settingName: SettingsEnum.langDefault,
          servicesNames,
          settingValue: langDefault,
        });
        this.isChanges = true;

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Language changed'),
          });
        }
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Edit lang default
    async editLangs(type: keyof typeof SendTypeEnum) {
      if (this.isLoading) return;
      this.isLoading = true;
      let langs: SettingsServicesType['langs']['settingValue'];
      let servicesNames: SettingsServicesType['langs']['servicesNames'];
      let errorsClear: Record<string, string>;

      switch (type) {
        case SendTypeEnum.site:
          langs = this.langsSite;
          servicesNames = [ServicesLangsEnum.site];
          errorsClear = { [ErrorsKeys.langDefaultSite]: '' };
          break;
        case SendTypeEnum.adminAndApi:
          langs = this.langsAdminAndApi;
          servicesNames = [ServicesLangsEnum.admin, ServicesLangsEnum.api];
          errorsClear = { [ErrorsKeys.langsAdmin]: '', [ErrorsKeys.langsApi]: '' };
          break;
        default:
          return;
      }
      this.$utils.clearErrors(this.errors, errorsClear);
      try {
        let response = await this.$api['settings'].editSetting({
          settingName: SettingsEnum.langs,
          servicesNames,
          settingValue: langs,
        });
        this.isChanges = true;
        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Language list changed'),
          });
        }
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
