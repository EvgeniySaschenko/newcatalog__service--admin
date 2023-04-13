import { $fetch } from './_core';
import { LabelType } from '@/types';

export default {
  // Create label for rating
  createLabel: async ({
    name,
    color,
    ratingId,
  }: Pick<LabelType, 'name' | 'color' | 'ratingId'>): Promise<Pick<LabelType, 'labelId'>> => {
    let result = await $fetch(`/api/labels`, {
      method: 'POST',
      body: JSON.stringify({ name, color, ratingId }),
    });
    return await result.json();
  },

  // Edit label for rating
  editLabel: async ({
    labelId,
    name,
    color,
    ratingId,
  }: Pick<LabelType, 'labelId' | 'name' | 'color' | 'ratingId'>): Promise<true> => {
    let result = await $fetch(`/api/labels/${labelId}`, {
      method: 'PUT',
      body: JSON.stringify({ labelId, name, color, ratingId }),
    });
    return await result.json();
  },

  // Delete label for rating
  deleteLabel: async ({
    labelId,
    ratingId,
  }: Pick<LabelType, 'labelId' | 'ratingId'>): Promise<true> => {
    let result = await $fetch(`/api/labels/${labelId}`, {
      method: 'DELETE',
      body: JSON.stringify({ labelId, ratingId }),
    });
    return await result.json();
  },

  // Get all labels for rating
  getLabels: async ({ ratingId }: Pick<LabelType, 'ratingId'>): Promise<LabelType[]> => {
    let result = await $fetch(`/api/labels/rating/${ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },
};
