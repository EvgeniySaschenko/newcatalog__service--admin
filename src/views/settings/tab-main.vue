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
        :error='errors[ErrorsKeys.langsAdmin]'
      )
        el-select(v-model='langsAdmin', multiple, filterable)
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
        @click='editLangs({ langs: langsAdmin, serviceName: ServicesLangsEnum.admin, errorKey: ErrorsKeys.langsAdmin })'
      ) {{ $t('Save') }}

    // Admin + API lang default
    el-descriptions-item
      el-form-item(
        :label='$t("Admin panel and API server, language by default")',
        :error='errors[ErrorsKeys.langDefaultAdmin]'
      )
        el-select(v-model='langDefaultAdmin', filterable)
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
        @click='editLangDefault({ langDefault: langDefaultAdmin, serviceName: ServicesLangsEnum.admin, errorKey: ErrorsKeys.langDefaultAdmin })'
      ) {{ $t('Save') }}

    // Site langs
    el-descriptions-item
      el-form-item(:label='$t("List of site languages")', :error='errors[ErrorsKeys.langsSite]')
        el-select(v-model='langsSite', multiple, filterable)
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
        @click='editLangs({ langs: langsSite, serviceName: ServicesLangsEnum.site, errorKey: ErrorsKeys.langsSite })'
      ) {{ $t('Save') }}

    // Site lang default
    el-descriptions-item
      el-form-item(
        :label='$t("Site default language")',
        :error='errors[ErrorsKeys.langDefaultSite]'
      )
        el-select(v-model='langDefaultSite', filterable)
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
        @click='editLangDefault({ langDefault: langDefaultSite, serviceName: ServicesLangsEnum.site, errorKey: ErrorsKeys.langDefaultSite })'
      ) {{ $t('S:ave') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useSettingsStore from '@/store/settings';

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
  langsAdmin: `${ServicesLangsEnum.admin}--${SettingsEnum.langs}`,
  langsSite: `${ServicesLangsEnum.site}--${SettingsEnum.langs}`,
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
      langDefaultAdmin: '' as SettingsType['langDefault']['admin'],
      // !!! For services "admin" and "api", used  lang "admin"
      langsAdmin: [] as SettingsType['langs']['admin'],
      langDefaultSite: '' as SettingsType['langDefault']['site'],
      langsSite: [] as SettingsType['langs']['site'],
      errors: {
        [ErrorsKeys.langDefaultAdmin]: '',
        [ErrorsKeys.langDefaultSite]: '',
        [ErrorsKeys.langsAdmin]: '',
        [ErrorsKeys.langsSite]: '',
      },
      ErrorsKeys,
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
      this.langDefaultAdmin = settings['langDefault'].admin;
      this.langsAdmin = settings['langs'].admin;
      this.langDefaultSite = settings['langDefault'].site;
      this.langsSite = settings['langs'].site;
    },

    // Edit lang default
    async editLangDefault({
      langDefault,
      serviceName,
      errorKey,
    }: {
      langDefault: SettingsServicesType['langDefault']['settingValue'];
      serviceName: SettingsServicesType['langDefault']['serviceName'];
      errorKey: keyof typeof ErrorsKeys;
    }) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [errorKey]: '' });
      try {
        let response = await this.$api['settings'].editSetting({
          settingName: SettingsEnum.langDefault,
          serviceName,
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
    async editLangs({
      langs,
      serviceName,
      errorKey,
    }: {
      langs: SettingsServicesType['langs']['settingValue'];
      serviceName: SettingsServicesType['langs']['serviceName'];
      errorKey: keyof typeof ErrorsKeys;
    }) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [errorKey]: '' });
      try {
        let response = await this.$api['settings'].editSetting({
          settingName: SettingsEnum.langs,
          serviceName,
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
