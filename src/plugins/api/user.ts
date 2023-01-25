import { $fetch, $utils } from './_core';

type ParamsType = {
  mail: string;
  name: string;
  password: string;
  code: string;
};

export default {
  // Зарегистрироватся
  registration: async ({ mail, name, password }: Omit<ParamsType, 'code'>) => {
    return await $fetch('/api/user/registration', {
      method: 'POST',
      body: JSON.stringify({ mail, name, password }),
    });
  },

  // Войти (Pick - позволяет использовать только указанные поля)
  auth: async ({ mail, password }: Pick<ParamsType, 'mail' | 'password'>) => {
    return await $fetch('/api/user/auth', {
      method: 'POST',
      body: JSON.stringify({ mail, password }),
    });
  },

  // Проверить наличие имени пользователя
  checkName: async ({ name }: Pick<ParamsType, 'name'>) => {
    return await $fetch(`/api/user/check?${$utils.convertToQueryParams({ name })}&type=checkName`, {
      method: 'GET',
    });
  },

  // Проверить наличие почты
  checkMail: async ({ mail }: Pick<ParamsType, 'mail'>) => {
    return await $fetch(`/api/user/check?${$utils.convertToQueryParams({ mail })}&type=checkName`, {
      method: 'GET',
    });
  },

  // Проверить наличие имени пользователя
  confirmMail: async ({ mail, code }: Pick<ParamsType, 'mail' | 'code'>) => {
    return await $fetch(
      `/api/user/check?${$utils.convertToQueryParams({ mail, code })}&type=confirmMail`,
      {
        method: 'GET',
      }
    );
  },
};
