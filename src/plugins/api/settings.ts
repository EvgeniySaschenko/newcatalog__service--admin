import { $fetch } from './_core';
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
  editLangDefault: async ({ type, lang }: Pick<SettingsLangDefaultType, 'type' | 'lang'>) => {
    let response = await $fetch('/api/settings/lang-default', {
      method: 'PUT',
      body: JSON.stringify({ type, lang }),
    });
    return await response.json();
  },

  // Edit lang list
  editLangsList: async ({ type, langs }: Pick<SettingsLangsListType, 'type' | 'langs'>) => {
    let response = await $fetch('/api/settings/langs-list', {
      method: 'PUT',
      body: JSON.stringify({ type, langs }),
    });
    return await response.json();
  },
};
