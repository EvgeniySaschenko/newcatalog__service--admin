import { $fetch } from './_core';
import { ServicesType, TranslationType, PaginationType } from '@/types';

export default {
  // Get part translations for service
  getTranslationsPartList: async ({
    serviceTypeName,
    page,
  }: {
    serviceTypeName: ServicesType;
    page: PaginationType['page'];
  }) => {
    let result = await $fetch(
      `/api/translations/part-list/?page=${page}&serviceTypeName=${serviceTypeName}`,
      {
        method: 'GET',
      }
    );
    return await result.json();
  },

  // Get translations for function translate
  getTranslationsForFunctionTranslate: async ({
    serviceTypeName,
  }: {
    serviceTypeName: ServicesType;
  }) => {
    let result = await $fetch(
      `/api/translations/function-translate/?serviceTypeName=${serviceTypeName}`,
      {
        method: 'GET',
      }
    );
    return await result.json();
  },

  // Create translations for service
  createTranslations: async ({ serviceTypeName }: { serviceTypeName: ServicesType }) => {
    let response = await $fetch(`/api/translations/create-for-service`, {
      method: 'POST',
      body: JSON.stringify({ serviceTypeName }),
    });
    return await response.json();
  },

  // Update text for translation
  editText: async ({ translationId, text }: Pick<TranslationType, 'translationId' | 'text'>) => {
    let response = await $fetch(`/api/translations/text/${translationId}`, {
      method: 'PUT',
      body: JSON.stringify({ translationId, text }),
    });
    return await response.json();
  },
};
