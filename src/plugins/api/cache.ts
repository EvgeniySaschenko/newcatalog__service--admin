import { $fetch } from './_core';
import { RatingType } from '@/types';

export default {
  // Create cache rating
  createCacheRating: async ({ ratingId }: Pick<RatingType, 'ratingId'>): Promise<true> => {
    let result = await $fetch(`/api/cache/rating/${ratingId}`, {
      method: 'POST',
      body: JSON.stringify({ ratingId }),
    });
    return await result.json();
  },

  // Delete cache rating
  deleteCacheRating: async ({ ratingId }: Pick<RatingType, 'ratingId'>): Promise<true> => {
    let result = await $fetch(`/api/cache/rating/${ratingId}`, {
      method: 'DELETE',
      body: JSON.stringify({ ratingId }),
    });
    return await result.json();
  },

  // Create new cache from all
  resetCacheAll: async (): Promise<true> => {
    let result = await $fetch(`/api/cache/reset-all`, {
      method: 'POST',
    });
    return await result.json();
  },

  // Clear cache all
  clearCacheAll: async (): Promise<true> => {
    let result = await $fetch(`/api/cache/clear-all`, {
      method: 'DELETE',
    });
    return await result.json();
  },

  // Create cache sections
  createCacheSections: async (): Promise<true> => {
    let result = await $fetch(`/api/cache/sections`, {
      method: 'POST',
    });
    return await result.json();
  },

  // Create cache settings
  createCacheSettings: async (): Promise<true> => {
    let result = await $fetch(`/api/cache/settings`, {
      method: 'POST',
    });
    return await result.json();
  },
};
