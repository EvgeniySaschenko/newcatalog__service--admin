import { $fetch, $utils } from './_core';
import { RatingType } from '@/types';

export default {
  // Сейчас используется кука для userId - нужно исправить и на беке
  // Get the ratings of the user who created them
  getRatingsUser: async (user: { userId: number }) => {
    let result = await $fetch(`/api/ratings/user/${user.userId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Get rating
  getRating: async (rating: { ratingId: number }) => {
    let result = await $fetch(`/api/ratings/${rating.ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create rating
  createRating: async ({
    name,
    descr,
    isHiden,
    sectionsIds,
    typeSort,
    typeDisplay,
    typeRating,
  }: RatingType) => {
    let result = await $fetch(`/api/ratings`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        descr,
        isHiden,
        sectionsIds,
        typeSort,
        typeDisplay,
        typeRating,
      }),
    });
    return await result.json();
  },

  // Edit rating
  editRating: async ({
    id,
    name,
    descr,
    isHiden,
    sectionsIds,
    typeSort,
    typeDisplay,
    typeRating,
  }: RatingType) => {
    let result = await $fetch(`/api/ratings`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        name,
        descr,
        isHiden,
        sectionsIds,
        typeSort,
        typeDisplay,
        typeRating,
      }),
    });
    return await result.json();
  },
};
