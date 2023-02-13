import { $fetch, $utils } from './_core';
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
    isCreatedScreen,
    isHiden,
    labelsIds,
    name,
    priority,
    ratingId,
    url,
  }: Omit<RatingItemType, 'ratingItemId' | 'img'>) => {
    let result = await $fetch(`/api/ratings-items`, {
      method: 'POST',
      body: JSON.stringify({
        isCreatedScreen,
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
    isCreatedScreen,
    isHiden,
    labelsIds,
    name,
    priority,
    ratingId,
    url,
  }: RatingItemType) => {
    let result = await $fetch(`/api/ratings-items/${ratingItemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ratingItemId,
        isCreatedScreen,
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
