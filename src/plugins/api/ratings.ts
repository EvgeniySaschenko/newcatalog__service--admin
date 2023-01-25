import { $fetch, $utils } from './_core';

type RatingType = {
  id: number;
  descr: object;
  name: object;
  sectionsIds: object;
  typeDisplay: 'tile' | 'inline';
  typeRating: 'site';
  typeSort: 'alexa' | 'click';
};

export default {
  // Сейчас используется кука для userId - нужно исправить и на беке
  // Get the ratings of the user who created them
  getRatingsUser: async (userId: number) => {
    let result = await $fetch(`/api/ratings/user/${userId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Get rating
  getRating: async (ratingId: number) => {
    let result = await $fetch(`/api/ratings/${ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create rating
  createRating: async ({
    descr,
    name,
    sectionsIds,
    typeDisplay,
    typeRating,
    typeSort,
  }: Omit<RatingType, 'id'>) => {
    let result = await $fetch(`/api/ratings`, {
      method: 'POST',
      body: JSON.stringify({ descr, name, sectionsIds, typeDisplay, typeRating, typeSort }),
    });
    return await result.json();
  },

  // Edit rating
  editRating: async ({
    id,
    descr,
    name,
    sectionsIds,
    typeDisplay,
    typeRating,
    typeSort,
  }: RatingType) => {
    let result = await $fetch(`/api/ratings`, {
      method: 'PUT',
      body: JSON.stringify({ id, descr, name, sectionsIds, typeDisplay, typeRating, typeSort }),
    });
    return await result.json();
  },
};
