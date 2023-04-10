import { $fetch } from './_core';
import { SettingsServicesType } from '@/types';

export default {
  // Get settings
  getSettings: async () => {
    let result = await $fetch(`/api/settings`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Edit setting
  editSetting: async ({
    settingName,
    serviceName,
    settingValue,
  }: SettingsServicesType[keyof SettingsServicesType]) => {
    let response = await $fetch(`/api/settings/${settingName}`, {
      method: 'PUT',
      body: JSON.stringify({ settingName, serviceName, settingValue }),
    });
    return await response.json();
  },
};
