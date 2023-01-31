import { $fetch, $utils } from './_core';
import { LabelType } from '@/types';

export default {
  // Create label for rating
  createLabel: async ({ name, color, ratingId }: Omit<LabelType, 'id'>) => {
    let result = await $fetch(`/api/ratings-labels`, {
      method: 'POST',
      body: JSON.stringify({ name, color, ratingId }),
    });
    return await result.json();
  },

  // Edit label for rating
  editLabel: async ({ id, name, color, ratingId }: LabelType) => {
    let result = await $fetch(`/api/ratings-labels/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, name, color, ratingId }),
    });
    return await result.json();
  },

  // Delete label for rating
  deleteLabel: async ({ id, ratingId }: Pick<LabelType, 'id' | 'ratingId'>) => {
    let result = await $fetch(`/api/ratings-labels/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id, ratingId }),
    });
    return await result.json();
  },

  // Get all labels for rating
  getLabels: async ({ ratingId }: Pick<LabelType, 'ratingId'>) => {
    let result = await $fetch(`/api/ratings-labels/rating/${ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // DELETE the
  // Edit all labels for rating
  // editLabels: async (labelsItems: LabelType[]) => {
  //   let result = await $fetch(`/api/ratings-items/labels/`, {
  //     method: 'PUT',
  //     body: JSON.stringify(labelsItems),
  //   });
  //   return await result.json();
  // },
};
