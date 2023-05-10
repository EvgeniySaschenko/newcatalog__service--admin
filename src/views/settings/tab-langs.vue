<template lang="pug">
include /src/mixins.pug

el-form.form-login(label-position='top')
  .u-mb--10
    el-alert(
      :title='$t(`For "admin" and "api" you need to set the same parameters.`)',
      type='warning',
      show-icon,
      :closable='false'
    )

  .u-mb--10
    el-alert(
      :title='$t("Sites will be displayed in the language you selected in the language switcher.")',
      type='warning',
      show-icon,
      :closable='false'
    )
  //
  .u-mb--10
    el-alert(
      :title='`${$t("Texts for the main site, in the admin panel will be displayed in the default language for the main site.")} ${$t("For example rating name or label text will be displayed in the main sat language.")}`',
      type='warning',
      show-icon,
      :closable='false'
    )

  .u-mb--10(v-for='(item, serviceName) in langsMap', v-loading='isLoading')
    el-descriptions(direction='vertical', :column='3', border)
      // langs
      el-descriptions-item
        el-form-item(
          :label='$t("List of languages")',
          :error='errors[`${serviceName}--${SettingsEnum.langs}`]'
        )
          el-select(v-model='langsMap[serviceName]', multiple, filterable, size='large')
            el-option(
              v-for='item in langsIso',
              :key='item.code',
              :label='item.name',
              :value='item.code'
            )
              b [{{ item.code }}] &nbsp;
              span {{ item.name }}

      el-descriptions-item(width='100', align='center')
        el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

      el-descriptions-item(width='100', align='center')
        el-button(type='primary', @click='editLangs(serviceName)') {{ $t('Save') }}

      // lang default
      el-descriptions-item
        el-form-item(
          :label='$t("Default language")',
          :error='errors[`${serviceName}--${SettingsEnum.langDefault}`]'
        )
          el-select(v-model='langDefaultMap[serviceName]', filterable, size='large')
            el-option(
              v-for='item in langsIso',
              :key='item.code',
              :label='item.name',
              :value='item.code'
            )
              b [{{ item.code }}] &nbsp;
              span {{ item.name }}

      el-descriptions-item(width='100', align='center')
        el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

      el-descriptions-item(width='100', align='center')
        el-button(type='primary', @click='editLangDefault(serviceName)') {{ $t('Save') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { SettingsType, LangsIsoType, SettingsEnum, ServicesLangsType } from '@/types';

export default defineComponent({
  data() {
    return {
      langsMap: {} as SettingsType['langs'],
      langDefaultMap: {} as SettingsType['langDefault'],
      // Indicates that there have been some changes in the settings
      isChanges: false,
      isLoading: false,
      langsIso: [] as LangsIsoType[],
      errors: {} as Record<string, string>,
      SettingsEnum,
    };
  },

  async mounted() {
    await this.init();
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
        this.langsMap = JSON.parse(JSON.stringify(settings.langs));
        this.langDefaultMap = JSON.parse(JSON.stringify(settings.langDefault));
        this.langsIso = langsIso;
        for (let serviceName in this.langsMap) {
          this.errors[`${serviceName}--${SettingsEnum.langDefault}`] = '';
          this.errors[`${serviceName}--${SettingsEnum.langs}`] = '';
        }
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Edit lang default
    async editLangDefault(serviceName: ServicesLangsType) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [`${serviceName}--${SettingsEnum.langDefault}`]: '' });
      try {
        let response = await this.$api['settings'].editSetting({
          settingName: SettingsEnum.langDefault,
          serviceName,
          settingValue: this.langDefaultMap[serviceName],
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

    // Edit langs
    async editLangs(serviceName: ServicesLangsType) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [`${serviceName}--${SettingsEnum.langs}`]: '' });

      try {
        let response = await this.$api['settings'].editSetting({
          settingName: SettingsEnum.langs,
          serviceName,
          settingValue: this.langsMap[serviceName],
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
