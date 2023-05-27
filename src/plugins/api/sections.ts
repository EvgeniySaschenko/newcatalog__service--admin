import { $fetch, $utils } from './_core';
import { SectionType } from '@/types';

export default {
  // Get all sections
  getSections: async (): Promise<SectionType[]> => {
    let result = await $fetch(`/api/sections`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create section
  createSection: async ({
    isHiden,
    name,
    descr,
    priority,
  }: Pick<SectionType, 'isHiden' | 'name' | 'descr' | 'priority'>): Promise<
    SectionType['sectionId']
  > => {
    let result = await $fetch(`/api/sections`, {
      method: 'POST',
      body: JSON.stringify({ isHiden, name, descr, priority }),
    });
    return await result.json();
  },

  // Edit section
  editSection: async ({
    sectionId,
    isHiden,
    name,
    descr,
    priority,
  }: Pick<SectionType, 'sectionId' | 'isHiden' | 'name' | 'descr' | 'priority'>): Promise<true> => {
    let result = await $fetch(`/api/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ sectionId, isHiden, name, descr, priority }),
    });
    return await result.json();
  },

  // Delete section
  deleteSection: async ({ sectionId }: Pick<SectionType, 'sectionId'>): Promise<true> => {
    let result = await $fetch(`/api/sections/${sectionId}`, {
      method: 'DELETE',
      body: JSON.stringify({ sectionId }),
    });
    return await result.json();
  },
};
