<template lang="pug">
include /src/mixins.pug

el-form.form-login(label-position='top')
  .u-mb--10
    el-alert(
      :title='$t(`After replacing the certificates, you must restart the server or container "proxy"`)',
      type='warning',
      show-icon,
      :closable='false'
    )
  .u-mb--10
    el-alert(
      :title='$t(`Certificates will change for the mode in which the "production" / "development" server is running`)',
      type='warning',
      show-icon,
      :closable='false'
    )

  .u-mb--10(v-loading='isLoading')
    el-descriptions(direction='vertical', :column='2', border)
      el-descriptions-item
        // сertificate
        el-form-item(:label='$t("Ssl сertificate")', :error='errors.cert')
          el-input(v-model='cert', type='textarea')
        // privateKey
        el-form-item(:label='$t("Ssl private key")', :error='errors.privateKey')
          el-input(v-model='privateKey', type='textarea')
        // serviceName
        el-form-item(:label='$t("For domain")', :error='errors.serviceName')
          el-select(v-model='serviceName')
            el-option(:label='ServicesEnum.admin', :value='ServicesEnum.admin')
            el-option(:label='ServicesEnum.site', :value='ServicesEnum.site')

      el-descriptions-item(width='100', align='center')
        el-button(type='primary', @click='editSslCertificate()') {{ $t('Save') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ServicesEnum } from '@/types';

export default defineComponent({
  data() {
    return {
      serviceName: '' as ServicesEnum.admin | ServicesEnum.site,
      privateKey: '',
      cert: '',
      errors: {
        privateKey: '',
        cert: '',
        serviceName: '',
      },
      isLoading: false,
      ServicesEnum,
    };
  },

  methods: {
    // Edit ssl certificate
    async editSslCertificate() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);
      try {
        let response = await this.$api['ssl-certificates'].editSslCertificate({
          cert: this.cert,
          privateKey: this.privateKey,
          serviceName: this.serviceName,
        });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('SSL certificate has been changed'),
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
