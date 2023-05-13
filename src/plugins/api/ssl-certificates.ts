import { $fetch } from './_core';
import { ServicesEnum } from '@/types';

export default {
  // Edit ssl certificate
  editSslCertificate: async ({
    cert,
    privateKey,
    serviceName,
  }: {
    cert: string;
    privateKey: string;
    serviceName: ServicesEnum.admin | ServicesEnum.site;
  }): Promise<true> => {
    let response = await $fetch(`/api/ssl-certificates`, {
      method: 'PUT',
      body: JSON.stringify({ cert, privateKey, serviceName }),
    });
    return await response.json();
  },
};
