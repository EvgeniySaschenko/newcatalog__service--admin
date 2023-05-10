<template lang="pug">
include /src/mixins.pug
.u-mb--10
el-form.form-login(label-position='top', v-loading='isLoading')
  el-collapse(v-model='collapseActive', accordion)
    // images
    el-collapse-item(:title='$t("Images")', :name='CollapseEnum.images')
      el-alert(
        :title='$t(`The favicon on the "site" is displayed immediately after saving the changes.`)',
        type='warning',
        show-icon,
        :closable='false'
      )

      .u-mb--10(v-for='(setting, settingName) in imagesMap')
        el-descriptions(
          direction='vertical',
          :column='3',
          border,
          v-for='(settingValue, serviceName) in imagesMap[settingName]'
        )
          el-descriptions-item
            el-form-item(
              :label='DescrImages[settingName]',
              :error='errors[`${serviceName}--${settingName}`]'
            )
              div
                img(:src='setting[serviceName]')

                el-upload(
                  :ref='`images-${settingName}-${serviceName}`',
                  :auto-upload='false',
                  :limit='1',
                  :accept='settingsExtends[settingName].mimeTypes.toString()',
                  @change='selectFileImage($event, { settingName, serviceName })',
                  @remove='clearFileImage({ settingName, serviceName })',
                  list-type='picture'
                )
                  .u-align-center(v-if='!imagesMapFiles[settingName][serviceName]')
                    el-icon.u-mr--5(size='40')
                      el-icon-upload-filled
                    div {{ $t('Select file') }}

          el-descriptions-item(width='100', align='center')
            el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

          el-descriptions-item(width='100', align='center')
            el-button(type='primary', @click='editSettingFile({ settingName, serviceName })') {{ $t('Save') }}

    // colors
    el-collapse-item(:title='$t("Colors")', :name='CollapseEnum.colors')
      .u-mb--10
        el-alert(
          :title='$t(`For the "error page" of the "site" the local colors will be used.`)',
          type='warning',
          show-icon,
          :closable='false'
        )

      .u-mb--10(v-for='(setting, settingName) in colorsMap')
        el-descriptions(
          direction='vertical',
          :column='3',
          border,
          v-for='(settingValue, serviceName) in colorsMap[settingName]'
        )
          el-descriptions-item
            el-form-item(
              :label='DescrColors[settingName]',
              :error='errors[`${serviceName}--${settingName}`]'
            )
              el-color-picker(v-model='setting[serviceName]', size='large')

          el-descriptions-item(width='100', align='center')
            el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

          el-descriptions-item(width='100', align='center')
            el-button(
              type='primary',
              @click='editSetting({ settingName, serviceName, settingValue: setting[serviceName] })'
            ) {{ $t('Save') }}

    // CodeOrText
    el-collapse-item(
      :title='$t("Code code HTML/CSS/JavaScript/Text")',
      :name='CollapseEnum.codeOrText'
    )
      .u-mb--10(v-for='(setting, settingName) in codeOrTextMap')
        el-descriptions(
          direction='vertical',
          :column='3',
          border,
          v-for='(settingValue, serviceName) in codeOrTextMap[settingName]'
        )
          el-descriptions-item
            el-form-item(
              :label='DescrCodeOrText[settingName]',
              :error='errors[`${serviceName}--${settingName}`]'
            )
              el-input(v-model='setting[serviceName]', type='textarea')

          el-descriptions-item(width='100', align='center')
            el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

          el-descriptions-item(width='100', align='center')
            el-button(
              type='primary',
              @click='editSetting({ settingName, serviceName, settingValue: setting[serviceName] })'
            ) {{ $t('Save') }}

    // Marketing
    el-collapse-item(:title='$t("Marketing / SEO")', :name='CollapseEnum.marketing')
      .u-mb--10(v-for='(setting, settingName) in marketingMap')
        el-descriptions(
          direction='vertical',
          :column='3',
          border,
          v-for='(settingValue, serviceName) in marketingMap[settingName]'
        )
          el-descriptions-item
            el-form-item(
              :label='DescrMarketing[settingName]',
              :error='errors[`${serviceName}--${settingName}`]'
            )
              el-input(v-model='setting[serviceName]', type='textarea')

          el-descriptions-item(width='100', align='center')
            el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

          el-descriptions-item(width='100', align='center')
            el-button(
              type='primary',
              @click='editSetting({ settingName, serviceName, settingValue: setting[serviceName] })'
            ) {{ $t('Save') }}

    // Backup
    el-collapse-item(:title='$t("Backup")', :name='CollapseEnum.backup')
      .u-mb--10(v-for='(settingValue, serviceName) in backupMap')
        el-descriptions(direction='vertical', :column='3', border)
          el-descriptions-item
            // host
            el-form-item(
              :label='$t("Host")',
              :error='errors[`${serviceName}--${SettingsBackupEnum.host}`]'
            )
              el-input(
                v-model='settingValue[SettingsBackupEnum.host]',
                :placeholder='$t("examplehost.com")'
              )
            // username
            el-form-item(
              :label='$t("Login")',
              :error='errors[`${serviceName}--${SettingsBackupEnum.username}`]'
            )
              el-input(v-model='settingValue[SettingsBackupEnum.username]')
            // port
            el-form-item(
              :label='$t("Port")',
              :error='errors[`${serviceName}--${SettingsBackupEnum.port}`]'
            )
              el-input-number(:min='0', v-model='settingValue[SettingsBackupEnum.port]')
            // remoteDir
            el-form-item(
              :label='$t("Directory")',
              :error='errors[`${serviceName}--${SettingsBackupEnum.remoteDir}`]'
            )
              el-input(
                v-model='settingValue[SettingsBackupEnum.remoteDir]',
                placeholder='/home/dir123'
              )
            // concurrency
            el-form-item(
              :label='$t("Concurrency")',
              :error='errors[`${serviceName}--${SettingsBackupEnum.concurrency}`]'
            )
              el-input-number(:min='1', v-model='settingValue[SettingsBackupEnum.concurrency]')
            // publicKey
            el-form-item(
              :label='`${$t("SSH public key.")} ${$t("Clearing this field will generate a new key.")}`',
              :error='errors[`${serviceName}--${SettingsBackupEnum.publicKey}`]'
            )
              el-input(v-model='settingValue[SettingsBackupEnum.publicKey]', type='textarea')
            // publicKeyComment
            el-form-item(
              :label='$t("Public key comment")',
              :error='errors[`${serviceName}--${SettingsBackupEnum.publicKeyComment}`]'
            )
              el-input(v-model='settingValue[SettingsBackupEnum.publicKeyComment]')

          el-descriptions-item(width='100', align='center')
            el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

          el-descriptions-item(width='100', align='center')
            el-button(
              type='primary',
              @click='editSetting({ settingName: SettingsEnum.backup, serviceName, settingValue: backupMap[serviceName], isRunInit: true })'
            ) {{ $t('Save') }}

    // Protector
    el-collapse-item(:title='$t("Server protector")', :name='CollapseEnum.protector')
      .u-mb--10
        el-alert(
          :title='$t(`If the protector server becomes unavailable, the check will be disabled`)',
          type='warning',
          show-icon,
          :closable='false'
        )

      .u-mb--10(v-for='(settingValue, serviceName) in protectorMap')
        el-descriptions(direction='vertical', :column='3', border)
          el-descriptions-item
            // Url
            el-form-item(
              :label='$t("Server url that allows / forbids sending requests to the API server")',
              :error='errors[`${serviceName}--${SettingsProtectorEnum.url}`]'
            )
              el-input(
                v-model='settingValue[SettingsProtectorEnum.url]',
                :placeholder='$t("https://url")'
              )

            // Text key
            el-form-item(
              :label='$t("The key (string) that the server should return in the response if requests to the API server are allowed")',
              :error='errors[`${serviceName}--${SettingsProtectorEnum.textKey}`]'
            )
              el-input(
                v-model='settingValue[SettingsProtectorEnum.textKey]',
                :placeholder='$t("Any string")'
              )

          el-descriptions-item(width='100', align='center')
            el-tag.u-m--5(type='danger', size='small') {{ serviceName.toUpperCase() }}

          el-descriptions-item(width='100', align='center')
            el-button(
              type='primary',
              @click='editSetting({ settingName: SettingsEnum.protector, serviceName, settingValue: protectorMap[serviceName], isRunInit: true })'
            ) {{ $t('Save') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  SettingsType,
  SettingsEnum,
  SettingsBackupEnum,
  SettingsProtectorEnum,
  SettingsServicesType,
  SettingsExtendsType,
} from '@/types';
import { $t } from '@/plugins/translations';

let DescrImages = {
  [SettingsEnum.imageAppLogo]: $t('Image logo'),
  [SettingsEnum.imageAppFavicon]: $t('Image favicon'),
  [SettingsEnum.imageAppPreloader]: $t('Image preloder'),
};

let DescrColors = {
  [SettingsEnum.colorBodyBackground]: $t('Background color - "body" tag'),
  [SettingsEnum.colorPrimary]: $t('Color primary'),
  [SettingsEnum.colorPrimaryInverted]: `${$t('Inverted primary color')} - 
  ${$t('an example would be white letters on the primary background.')}`,
  [SettingsEnum.colorTextRegular]: $t('Color regular text - an example would be plain black text.'),
  [SettingsEnum.colorSelectionBackground]: $t('Selection color - background.'),
  [SettingsEnum.colorSelectionText]: $t('Selection color - text.'),
};

let DescrCodeOrText = {
  [SettingsEnum.headScript]: $t('This JavaScript will be added to the "head" tag'),
  [SettingsEnum.headStyles]: $t('This CSS will be added to the "head" tag'),
  [SettingsEnum.headerHtml]: $t('This HTML will be added to the "header" tag'),
  [SettingsEnum.headerInfoHtml]: $t('Info bar above "header"'),
  [SettingsEnum.contentTopHtml]: $t('This HTML will be added after the "header" tag'),
  [SettingsEnum.contentBottomHtml]: $t('This HTML will be added before the "footer" tag'),
  [SettingsEnum.footerHtml]: $t('This HTML will be added after the "footer" tag'),
};
let pageTitlePrefix = $t('The phrase that will be added at the beginning of the "title" tag');

let DescrMarketing = {
  [SettingsEnum.pageTitlePrefix]: pageTitlePrefix,
  [SettingsEnum.pageTitleSufix]: $t('Phrase that will be added at the end of the "title" tag'),
  [SettingsEnum.googleTagManagerId]: $t('To activate Google Tag Manager, add your id'),
};
type ServicesImagesType = keyof SettingsType[keyof typeof DescrImages];

enum CollapseEnum {
  images = 'images',
  colors = 'colors',
  codeOrText = 'codeOrText',
  marketing = 'marketing',
  backup = 'backup',
  protector = 'protector',
}

export default defineComponent({
  data() {
    return {
      settingsExtends: {} as SettingsExtendsType,
      imagesMap: {} as Pick<SettingsType, keyof typeof DescrImages>,
      imagesMapFiles: {} as Record<
        keyof typeof DescrImages,
        Record<ServicesImagesType, File | null>
      >,
      colorsMap: {} as Pick<SettingsType, keyof typeof DescrColors>,
      codeOrTextMap: {} as Pick<SettingsType, keyof typeof DescrCodeOrText>,
      marketingMap: {} as Pick<SettingsType, keyof typeof DescrMarketing>,
      backupMap: {} as SettingsType['backup'],
      protectorMap: {} as SettingsType['protector'],
      // Indicates that there have been some changes in the settings
      isLoading: false,
      errors: {} as Record<string, string>,
      SettingsEnum,
      SettingsBackupEnum,
      SettingsProtectorEnum,
      DescrImages,
      DescrColors,
      DescrCodeOrText,
      DescrMarketing,
      collapseActive: '' as CollapseEnum,
      CollapseEnum,
    };
  },

  async mounted() {
    this.isLoading = true;
    await this.init();
    this.isLoading = false;
  },

  methods: {
    // Init
    async init() {
      try {
        let { settings, settingsExtends } = await this.$api['settings'].getSettings();

        // mime types for images
        this.settingsExtends = settingsExtends;

        // errors
        let setKeysErrors = (keysSettings: Partial<Record<string, string>>) => {
          let settingName: any;
          for (settingName in keysSettings) {
            for (let serviceName in (settings as any)[settingName]) {
              this.errors[`${serviceName}--${settingName}`] = '';
            }
          }
        };

        // state
        let setKeysState = (
          keysSettings: Partial<Record<keyof SettingsType, string>>,
          objTarget: Partial<SettingsType>
        ) => {
          type SettingNameType = keyof SettingsType;
          let settingName: SettingNameType;
          for (settingName in keysSettings) {
            if (!objTarget[settingName]) {
              Object.assign(objTarget, { [settingName]: {} });
            }

            let serviceName: any;
            for (serviceName in settings[settingName]) {
              let value = JSON.parse(JSON.stringify((settings as any)[settingName][serviceName]));
              (objTarget as any)[settingName][serviceName] = value;
            }
          }
        };

        setKeysState(DescrImages, this.imagesMap);
        setKeysState(DescrColors, this.colorsMap);
        setKeysState(DescrCodeOrText, this.codeOrTextMap);
        setKeysState(DescrMarketing, this.marketingMap);
        this.backupMap = settings.backup;
        this.protectorMap = settings.protector;

        setKeysErrors(DescrImages);
        setKeysErrors(DescrColors);
        setKeysErrors(DescrCodeOrText);
        setKeysErrors(DescrMarketing);
        // backup
        for (let serviceName in this.backupMap) {
          for (let settingName in (this.backupMap as any)[serviceName]) {
            this.errors[`${serviceName}--${settingName}`] = '';
          }
        }

        // protector
        for (let serviceName in this.protectorMap) {
          for (let settingName in (this.protectorMap as any)[serviceName]) {
            this.errors[`${serviceName}--${settingName}`] = '';
          }
        }

        let createImagesMapFiles = () => {
          let settingName: keyof typeof this.imagesMap;
          for (settingName in this.imagesMap) {
            let setting = this.imagesMap[settingName];
            let serviceName: keyof typeof setting;
            for (serviceName in this.imagesMap[settingName]) {
              if (!this.imagesMapFiles[settingName]) {
                this.imagesMapFiles[settingName] = {} as any;
              }

              this.imagesMapFiles[settingName][serviceName] = null;
            }
          }
        };
        createImagesMapFiles();
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      }
    },

    // Edit setting
    async editSetting({
      settingName,
      serviceName,
      settingValue,
      isRunInit = false,
    }: SettingsServicesType & { isRunInit: boolean }) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [`${serviceName}--${settingName}`]: '' });
      try {
        let response = await this.$api['settings'].editSetting({
          settingName,
          serviceName,
          settingValue,
        });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Setting edited'),
          });

          if (isRunInit) {
            await this.init();
          }
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

    // Edit setting file
    async editSettingFile({
      settingName,
      serviceName,
    }: {
      settingName: keyof typeof DescrImages;
      serviceName: ServicesImagesType;
    }) {
      let file = this.imagesMapFiles[settingName][serviceName];
      if (this.isLoading) return;

      if (!file) {
        this.$utils.setErrors(this.errors, {
          [`${serviceName}--${settingName}`]: this.$t('File not selected'),
        });
        return;
      }

      this.isLoading = true;
      this.$utils.clearErrors(this.errors, { [`${serviceName}--${settingName}`]: '' });
      try {
        let response = await this.$api['settings'].editSettingFile({
          settingName,
          serviceName,
          settingValue: file,
        });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Setting edited'),
          });
          this.clearFileImage({ settingName, serviceName });

          (this.$refs[`images-${settingName}-${serviceName}`] as any)[0].clearFiles();
          await this.init();
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

    // Select file image
    selectFileImage(
      file: File,
      data: {
        settingName: keyof typeof DescrImages;
        serviceName: ServicesImagesType;
      }
    ) {
      let { settingName, serviceName } = data;
      this.$utils.clearErrors(this.errors, { [`${serviceName}--${settingName}`]: '' });
      this.imagesMapFiles[settingName][serviceName] = (file as any).raw;
    },

    // Clear file image
    clearFileImage({
      settingName,
      serviceName,
    }: {
      settingName: keyof typeof DescrImages;
      serviceName: ServicesImagesType;
    }) {
      this.imagesMapFiles[settingName][serviceName] = null;
    },
  },
});
</script>

<style lang="sass" scoped></style>
