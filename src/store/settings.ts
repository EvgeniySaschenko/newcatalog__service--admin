import { defineStore } from 'pinia';
import { SettingsType } from '@/types';

export default defineStore('settings', {
  state: () => ({
    settings: {} as SettingsType,
  }),
  actions: {
    // Set settings
    setSettings(settings: SettingsType) {
      this.settings = settings;
    },
  },
});
