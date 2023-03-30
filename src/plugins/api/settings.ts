import { $fetch, $utils } from './_core';
import { SettingsLangDefaultType, SettingsLangsListType } from '@/types';

export default {
  // Get settings
  getSettings: async () => {
    let result = await $fetch(`/api/settings`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Edit lang default
  editLangDefault: async ({ name, lang }: SettingsLangDefaultType) => {
    let response = await $fetch('/api/settings/lang-default', {
      method: 'PUT',
      body: JSON.stringify({ name, lang }),
    });
    return await response.json();
  },

  // Edit lang list
  editLangsList: async ({ name, langs }: SettingsLangsListType) => {
    let response = await $fetch('/api/settings/langs-list', {
      method: 'PUT',
      body: JSON.stringify({ name, langs }),
    });
    return await response.json();
  },
};
