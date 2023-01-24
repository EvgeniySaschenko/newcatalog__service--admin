<template lang="pug">
include /src/mixins.pug

+b.page--login
  +e.H1.title Login page
  +e.description The router redirects the user to the login page. Because the user does not have a cookie named "user" installed.

//- el-form
//-   el-form-item(:error="messages.name", label="Имя пользователя", required)
//-     el-input(placeholder="Имя пользователя", v-model="name")
//-   el-form-item(:error="errors.mail", label="E-mail", required)
//-     el-input(placeholder="E-mail", v-model="mail")
//-   el-form-item(label="Пароль", required)
//-     el-input(placeholder="Имя пользователя", v-model="password")
</template>

<script lang="ts">
export default {};
</script>
