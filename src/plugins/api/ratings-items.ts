import { $fetch } from './_core';
import { RatingType, RatingItemType, RatingSortTypeEnum } from '@/types';

export default {
  // Get rating items (getRatingItems)
  getItems: async ({
    ratingId,
    typeSort,
  }: {
    ratingId: RatingType['ratingId'];
    typeSort: RatingSortTypeEnum;
  }) => {
    let result = await $fetch(`/api/ratings-items/rating/${ratingId}?typeSort=${typeSort}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create item for rating
  createItem: async ({
    isHiden,
    labelsIds,
    name,
    priority,
    ratingId,
    url,
  }: Pick<RatingItemType, 'isHiden' | 'labelsIds' | 'name' | 'priority' | 'ratingId' | 'url'>) => {
    let result = await $fetch(`/api/ratings-items`, {
      method: 'POST',
      body: JSON.stringify({
        isHiden,
        labelsIds,
        name,
        priority,
        ratingId,
        url,
      }),
    });
    return await result.json();
  },

  // Edit item for rating
  editItem: async ({
    ratingItemId,
    isHiden,
    labelsIds,
    name,
    priority,
    ratingId,
    url,
  }: Pick<
    RatingItemType,
    'ratingItemId' | 'isHiden' | 'labelsIds' | 'name' | 'priority' | 'ratingId' | 'url'
  >) => {
    let result = await $fetch(`/api/ratings-items/${ratingItemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ratingItemId,
        isHiden,
        labelsIds,
        name,
        priority,
        ratingId,
        url,
      }),
    });
    return await result.json();
  },

  // Delete item for rating
  deleteItem: async ({ ratingItemId }: Pick<RatingItemType, 'ratingItemId'>) => {
    let result = await $fetch(`/api/ratings-items/${ratingItemId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        ratingItemId,
      }),
    });
    return await result.json();
  },
};
