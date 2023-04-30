<template lang="pug">
include /src/mixins.pug
.u-mb--10
  el-alert(
    :title='$t(`To see the changes in the admin panel, you need to refresh the page`)',
    type='info',
    show-icon,
    :closable='false'
  )
.u-mb--10
  el-alert(
    :title='$t(`Changes will be displayed on the "site" after the cache is published.`)',
    type='info',
    show-icon,
    :closable='false'
  )
.u-mb--10
  el-alert(
    :title='$t(`The favicon on the "site" is displayed immediately after saving the changes.`)',
    type='info',
    show-icon,
    :closable='false'
  )
.u-mb--10
  el-alert(
    :title='$t(`For the "error page" of the "site" the local colors will be used.`)',
    type='info',
    show-icon,
    :closable='false'
  )

el-form.form-login(label-position='top', v-loading='isLoading')
  el-collapse(v-model='collapseActive', accordion)
    // images
    el-collapse-item(:title='$t("Images")', :name='CollapseEnum.images')
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
      :name='CollapseEnum.CodeOrText'
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SettingsType, SettingsEnum, SettingsServicesType, SettingsExtendsType } from '@/types';
import { $t } from '@/plugins/translations';

let DescrImages = {
  [SettingsEnum.imageAppLogo]: $t('Image logo'),
  [SettingsEnum.imageAppFavicon]: $t('Image favicon'),
  [SettingsEnum.imageAppPreloader]: $t('Image preloder'),
};

let DescrColors = {
  [SettingsEnum.colorPrimary]: $t('Color primary'),
  [SettingsEnum.colorPrimaryInverted]: `${$t('Inverted primary color')} - 
  ${$t('an example would be white letters on the main background.')}`,
  [SettingsEnum.colorTextRegular]: $t('Color regular text - an example would be plain black text.'),
  [SettingsEnum.colorSelectionBackground]: $t('Selection color - background.'),
  [SettingsEnum.colorSelectionText]: $t('Selection color - text.'),
};

let DescrCodeOrText = {
  [SettingsEnum.headScript]: $t('This JavaScript will be added to the "head" tag'),
  [SettingsEnum.headStyles]: $t('This CSS will be added to the "head" tag'),
  [SettingsEnum.headerHtml]: $t('This HTML will be added to the "header" tag'),
  [SettingsEnum.contentTopHtml]: $t('This HTML will be added after the "header" tag'),
  [SettingsEnum.contentBottomHtml]: $t('This HTML will be added before the "footer" tag'),
  [SettingsEnum.footerHtml]: $t('This HTML will be added after the "footer" tag'),
};

type ServicesImagesType = keyof SettingsType[keyof typeof DescrImages];

enum CollapseEnum {
  images = 'images',
  colors = 'colors',
  codeOrText = 'codeOrText',
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
      // Indicates that there have been some changes in the settings
      isLoading: false,
      errors: {} as Record<string, string>,
      SettingsEnum,
      DescrImages,
      DescrColors,
      DescrCodeOrText,
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
        let setKeysErrors = (keysSettings: Partial<Record<keyof SettingsType, string>>) => {
          let settingName: keyof SettingsType;
          for (settingName in keysSettings) {
            for (let serviceName in settings[settingName]) {
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

            let serviceName: keyof SettingsType[keyof SettingsType];
            for (serviceName in settings[settingName]) {
              let value = JSON.parse(JSON.stringify(settings[settingName][serviceName]));
              (objTarget as any)[settingName][serviceName] = value;
            }
          }
        };

        setKeysState(DescrImages, this.imagesMap);
        setKeysState(DescrColors, this.colorsMap);
        setKeysState(DescrCodeOrText, this.codeOrTextMap);

        setKeysErrors(DescrImages);
        setKeysErrors(DescrColors);
        setKeysErrors(DescrCodeOrText);

        // files images
        (() => {
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
        })();
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      }
    },

    // Edit setting
    async editSetting({
      settingName,
      serviceName,
      settingValue,
    }: SettingsServicesType[keyof SettingsServicesType]) {
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
