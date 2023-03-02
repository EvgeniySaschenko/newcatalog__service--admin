import { $fetch, $utils } from './_core';
import { RatingType } from '@/types';

export default {
  // Create cache rating
  createCacheRating: async ({ ratingId }: { ratingId: RatingType['ratingId'] }) => {
    let result = await $fetch(`/api/cache/rating/${ratingId}`, {
      method: 'POST',
      body: JSON.stringify({ ratingId }),
    });
    return await result.json();
  },

  // Delete cache rating
  deleteCacheRating: async ({ ratingId }: { ratingId: RatingType['ratingId'] }) => {
    let result = await $fetch(`/api/cache/rating/${ratingId}`, {
      method: 'DELETE',
      body: JSON.stringify({ ratingId }),
    });
    return await result.json();
  },

  // Create new cache from all
  resetCacheAll: async () => {
    let result = await $fetch(`/api/cache/reset-all`, {
      method: 'POST',
    });
    return await result.json();
  },

  // Clear cache all
  clearCacheAll: async () => {
    let result = await $fetch(`/api/cache/clear-all`, {
      method: 'DELETE',
    });
    return await result.json();
  },

  // Create cache sections
  createCacheSections: async () => {
    let result = await $fetch(`/api/cache/sections`, {
      method: 'POST',
    });
    return await result.json();
  },
};
