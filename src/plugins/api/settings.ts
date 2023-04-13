import { $fetch } from './_core';
import { SettingsServicesType, SettingsType, LangsIsoType } from '@/types';

export default {
  // Get settings
  getSettings: async (): Promise<{ settings: SettingsType; langsIso: LangsIsoType[] }> => {
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
  }: SettingsServicesType[keyof SettingsServicesType]): Promise<true> => {
    let response = await $fetch(`/api/settings/${settingName}`, {
      method: 'PUT',
      body: JSON.stringify({ settingName, serviceName, settingValue }),
    });
    return await response.json();
  },
};
