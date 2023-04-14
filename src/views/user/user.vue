<template lang="pug">
include /src/mixins.pug

+b.page--cache.container
  +e.H1.title {{ $t($route.name) }}
  el-form.form-login(label-position='top', v-loading='isLoading')
    el-descriptions(direction='vertical', :column='2', border)
      // E-mail
      el-descriptions-item
        el-form-item(:error='errors.email')
          el-input(
            placeholder='E-mail',
            v-model='email',
            style='width: 100%',
            type='email',
            autocomplete='on',
            name='email'
          )
      el-descriptions-item(width='200', align='center')
        el-button(type='primary', @click='editEmail()') {{ $t('Change E-mail') }}

      // Password
      el-descriptions-item
        el-form-item(:error='errors.password')
          el-input(
            :placeholder='$t("Password")',
            v-model='password',
            style='width: 100%',
            type='password',
            name='password'
          )
      el-descriptions-item(align='center')
        el-button(type='primary', @click='editPassword()') {{ $t('Change password') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'page-user',
  data() {
    return {
      // loading data
      isLoading: false,
      // Email
      email: '',
      // Password
      password: '',
      // Errors
      errors: {
        email: '',
        password: '',
      },
    };
  },

  methods: {
    // Edit email
    async editEmail() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);
      try {
        let response = await this.$api['users'].editEmail({ email: this.email });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('E-mail updated'),
          });
          return;
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

    // Edit password
    async editPassword() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$utils.clearErrors(this.errors, this.errors);
      try {
        let response = await this.$api['users'].editPassword({ password: this.password });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Password updated'),
          });
          return;
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
