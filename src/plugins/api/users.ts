import { $fetch } from './_core';

type ParamsType = {
  email: string;
  name: string;
  password: string;
  password2: string;
  code: string;
};

export default {
  // Login
  login: async ({ email, password }: Pick<ParamsType, 'email' | 'password'>): Promise<true> => {
    let response = await $fetch('/api/users/login', {
      method: 'PUT',
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  // Log out
  logOut: async (): Promise<true> => {
    let response = await $fetch('/api/users/log-out', {
      method: 'PUT',
    });
    return await response.json();
  },

  // Refresh auth
  refreshAuth: async (): Promise<true> => {
    let response = await $fetch('/api/users/auth-refresh', {
      method: 'PUT',
    });
    return await response.json();
  },

  // Refresh password
  editPassword: async ({
    password,
    password2,
  }: Pick<ParamsType, 'password' | 'password2'>): Promise<true> => {
    let response = await $fetch('/api/users/password', {
      method: 'PUT',
      body: JSON.stringify({ password, password2 }),
    });
    return await response.json();
  },

  // Refresh email
  editEmail: async ({ email }: Pick<ParamsType, 'email'>): Promise<true> => {
    let response = await $fetch('/api/users/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
    return await response.json();
  },
};
