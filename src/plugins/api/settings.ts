import { $fetch } from './_core';
import { SettingsServicesType, SettingsType, LangsIsoType, SettingsExtendsType } from '@/types';

export default {
  // Get settings
  getSettings: async (): Promise<{
    settings: SettingsType;
    settingsExtends: SettingsExtendsType;
    langsIso: LangsIsoType[];
  }> => {
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

  // Edit setting file
  editSettingFile: async ({
    settingName,
    serviceName,
    settingValue,
  }: {
    settingName: SettingsServicesType[keyof SettingsServicesType]['settingName'];
    serviceName: SettingsServicesType[keyof SettingsServicesType]['serviceName'];
    settingValue: File;
  }): Promise<true> => {
    let data = new FormData();
    data.append('settingValue', settingValue);
    data.append('settingName', JSON.stringify(settingName));
    data.append('serviceName', JSON.stringify(serviceName));

    let response = await $fetch(`/api/settings/files/${settingName}`, {
      method: 'PUT',
      headers: {},
      body: data,
    });
    return await response.json();
  },
};
