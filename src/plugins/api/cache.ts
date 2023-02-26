import { $fetch, $utils } from './_core';

export default {
  // Create cache
  createCache: async () => {
    let result = await $fetch(`/api/cache/create`, {
      method: 'POST',
    });
    return await result.json();
  },

  // Reset cache
  resetCache: async () => {
    let result = await $fetch(`/api/cache/reset`, {
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
};
