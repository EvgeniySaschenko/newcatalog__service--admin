import { $fetch, $utils } from './_core';
import { TranslationTypeNameType, TranslationType, PaginationType } from '@/types';

export default {
  // Get translations for service
  getTranslations: async ({
    typeName,
    page,
  }: {
    typeName: TranslationTypeNameType;
    page: PaginationType['page'];
  }) => {
    let result = await $fetch(`/api/translations/${typeName}?page=${page}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create translitions for service
  createTranslitions: async ({ typeName }: { typeName: TranslationTypeNameType }) => {
    let response = await $fetch(`/api/translations/create-for-service/${typeName}`, {
      method: 'POST',
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
