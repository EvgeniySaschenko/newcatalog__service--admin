import { $fetch, $utils } from './_core';

type ParamsType = {
  email: string;
  name: string;
  password: string;
  code: string;
};

export default {
  // Login
  login: async ({ email, password }: Pick<ParamsType, 'email' | 'password'>) => {
    let response = await $fetch('/api/user/login', {
      method: 'PUT',
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  // Log out
  logOut: async () => {
    let response = await $fetch('/api/user/log-out', {
      method: 'PUT',
    });
    return await response.json();
  },

  // Refresh auth
  refreshAuth: async () => {
    let response = await $fetch('/api/user/auth-refresh', {
      method: 'PUT',
    });
    return await response.json();
  },

  // Refresh password
  editPassword: async ({ password }: Pick<ParamsType, 'password'>) => {
    let response = await $fetch('/api/user/password', {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
    return await response.json();
  },

  // Refresh email
  editEmail: async ({ email }: Pick<ParamsType, 'email'>) => {
    let response = await $fetch('/api/user/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
    return await response.json();
  },
};
