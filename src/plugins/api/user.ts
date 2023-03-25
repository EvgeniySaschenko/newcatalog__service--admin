import { $fetch, $utils } from './_core';

type ParamsType = {
  mail: string;
  name: string;
  password: string;
  code: string;
};

export default {
  // Войти (Pick - позволяет использовать только указанные поля)
  login: async ({ mail, password }: Pick<ParamsType, 'mail' | 'password'>) => {
    let response = await $fetch('/api/user/login', {
      method: 'PUT',
      body: JSON.stringify({ mail, password }),
    });
    return await response.json();
  },

  // Войти (Pick - позволяет использовать только указанные поля)
  logOut: async () => {
    let response = await $fetch('/api/user/log-out', {
      method: 'PUT',
    });
    return await response.json();
  },

  refreshAuth: async () => {
    let response = await $fetch('/api/user/refresh-auth', {
      method: 'PUT',
    });
    return await response.json();
  },
};
