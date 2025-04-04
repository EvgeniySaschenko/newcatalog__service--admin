<template lang="pug">
include /src/mixins.pug

+b.page--login
  el-form.form-login(label-position='top', v-loading='isLoading')
    +e.H1.title {{ $t('Login') }}
    // E-mail
    el-form-item(label='E-mail', required, :error='errors.email')
      el-input#email(
        placeholder='E-mail',
        v-model='email',
        style='width: 100%',
        type='email',
        autocomplete='on',
        name='email'
      )
    // password
    el-form-item(:label='$t("Password")', required, :error='errors.password')
      el-input#password(
        :placeholder='$t("Password")',
        v-model='password',
        style='width: 100%',
        type='password',
        name='password',
        autocomplete='on'
      )

    el-form-item
      el-button(native-type='submit', type='primary', @click.prevent='send()', style='width: 100%') {{ $t('Send') }}

    el-alert(:title='errors.auth', type='error', center, v-if='errors.auth') 
    el-alert(
      :title='errors.countLoginAttempt',
      type='error',
      center,
      v-if='errors.countLoginAttempt'
    ) 
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errors: {
        auth: '',
        password: '',
        email: '',
        countLoginAttempt: '',
      },
    };
  },

  methods: {
    // User login
    async send() {
      this.$utils.clearErrors(this.errors, this.errors);
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$api['users'].login({
          email: this.email,
          password: this.password,
        });

        window.location.href = this.$config['pages-specific'].default;
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

<style lang="sass">
@import "@/assets/style/_variables.sass"

.page
  background-color: $app-primary-color
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  padding: 10px
  &__title
    text-align: center
  .form-login
    max-width: 400px
    width: 100%
    padding: 20px
    background-color: #ffffff
    border-radius: 8px
</style>
