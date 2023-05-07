import { $fetch } from './_core';
import { BackupType, PaginationType } from '@/types';

export default {
  // Run backup
  runBackup: async (): Promise<true> => {
    let result = await $fetch(`/api/backups/run`, {
      method: 'POST',
    });
    return await result.json();
  },

  // Get backups
  getBackups: async ({
    page,
  }: {
    page: PaginationType['page'];
  }): Promise<{ items: BackupType[] } & PaginationType> => {
    let result = await $fetch(`/api/backups?page=${page}`, {
      method: 'GET',
    });
    return await result.json();
  },
};
