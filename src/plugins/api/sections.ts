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
  createSection: async ({ name }: Pick<SectionType, 'name'>) => {
    let result = await $fetch(`/api/sections`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return await result.json();
  },

  // Edit section
  editSection: async ({ id, isHiden, name, priority }: SectionType) => {
    let result = await $fetch(`/api/sections`, {
      method: 'PUT',
      body: JSON.stringify({ id, isHiden, name, priority }),
    });
    return await result.json();
  },

  // Delete section
  deleteSection: async ({ id }: Pick<SectionType, 'id'>) => {
    let result = await $fetch(`/api/sections/${id}`, {
      method: 'DELETE',
    });
    return await result.json();
  },
};
