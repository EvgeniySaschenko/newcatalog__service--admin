import { $fetch, $utils } from './_core';
import { RatingItemType, RatingSortType } from '@/types';

export default {
  // Get rating items (getRatingItems)
  getItems: async (rating: { ratingId: number; typeSort: RatingSortType }) => {
    let result = await $fetch(
      `/api/ratings-items/rating/${rating.ratingId}?typeSort=${rating.typeSort}`,
      {
        method: 'GET',
      }
    );
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
  }: Omit<RatingItemType, 'id' | 'img'>) => {
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
    id,
    isCreatedScreen,
    isHiden,
    labelsIds,
    name,
    priority,
    ratingId,
    url,
  }: RatingItemType) => {
    let result = await $fetch(`/api/ratings-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
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
  deleteItem: async (rating: { ratingItemId: number }) => {
    let result = await $fetch(`/api/ratings-items/${rating.ratingItemId}`, {
      method: 'DELETE',
    });
    return await result.json();
  },

  // Елементы рейтинга для которых есть скриншоты, которые нужно обработать
  getSitesSreens: async (ratingId: number) => {
    let result = await $fetch(`/api/ratings-items/sites-screens/${ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Создать логотип сайта
  createSiteLogo: async (ratingId: number) => {
    let result = await $fetch(`/api/ratings-items/sites-logos/${ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },
};
