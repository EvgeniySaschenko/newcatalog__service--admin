import { $fetch } from './_core';
import { ServicesType, TranslationType, PaginationType } from '@/types';

export default {
  // Get part translations for service
  getTranslationsPartList: async ({
    serviceName,
    page,
  }: {
    serviceName: ServicesType;
    page: PaginationType['page'];
  }) => {
    let result = await $fetch(
      `/api/translations/part-list/?page=${page}&serviceName=${serviceName}`,
      {
        method: 'GET',
      }
    );
    return await result.json();
  },

  // Get translations for function translate
  getTranslationsForFunctionTranslate: async ({ serviceName }: { serviceName: ServicesType }) => {
    let result = await $fetch(`/api/translations/function-translate/?serviceName=${serviceName}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create translations for service
  createTranslations: async ({ serviceName }: { serviceName: ServicesType }) => {
    let response = await $fetch(`/api/translations/create-for-service`, {
      method: 'POST',
      body: JSON.stringify({ serviceName }),
    });
    return await response.json();
  },

  // Update text for translation
  editText: async ({
    translationId,
    text,
    serviceName,
  }: {
    translationId: TranslationType['translationId'];
    text: TranslationType['text'];
    serviceName: ServicesType;
  }) => {
    let response = await $fetch(`/api/translations/text/${translationId}`, {
      method: 'PUT',
      body: JSON.stringify({ translationId, text, serviceName }),
    });
    return await response.json();
  },
};
