import { $fetch } from './_core';
import { BackupType, BackupRestoreType, PaginationType } from '@/types';

export default {
  // Create backup
  createBackup: async (): Promise<true> => {
    let result = await $fetch(`/api/backups/create`, {
      method: 'POST',
    });
    return await result.json();
  },

  // Restore backup
  restoreBackup: async ({ remoteDirPath }: { remoteDirPath: string }): Promise<true> => {
    let result = await $fetch(`/api/backups/restore`, {
      method: 'POST',
      body: JSON.stringify({ remoteDirPath }),
    });
    return await result.json();
  },

  // Get backups list
  getBackupsList: async ({
    page,
  }: {
    page: PaginationType['page'];
  }): Promise<{ items: BackupType[] } & PaginationType> => {
    let result = await $fetch(`/api/backups/backups-list?page=${page}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Get restores list
  getRestoresList: async ({
    page,
  }: {
    page: PaginationType['page'];
  }): Promise<{ items: BackupRestoreType[] } & PaginationType> => {
    let result = await $fetch(`/api/backups/restores-list?page=${page}`, {
      method: 'GET',
    });
    return await result.json();
  },
};
