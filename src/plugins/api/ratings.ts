import { $fetch } from './_core';
import { RatingType, RatingsListItemType } from '@/types';

export default {
  // Get the ratings of the user who created them
  getRatings: async (): Promise<RatingsListItemType[]> => {
    let result = await $fetch(`/api/ratings`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Get rating
  getRating: async ({ ratingId }: Pick<RatingType, 'ratingId'>): Promise<RatingType> => {
    let result = await $fetch(`/api/ratings/${ratingId}`, {
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
  }: Pick<
    RatingType,
    'name' | 'descr' | 'isHiden' | 'sectionsIds' | 'typeSort' | 'typeDisplay' | 'typeRating'
  >): Promise<Pick<RatingType, 'ratingId'>> => {
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
    ratingId,
    name,
    descr,
    isHiden,
    sectionsIds,
    typeSort,
    typeDisplay,
    typeRating,
  }: Pick<
    RatingType,
    | 'ratingId'
    | 'name'
    | 'descr'
    | 'isHiden'
    | 'sectionsIds'
    | 'typeSort'
    | 'typeDisplay'
    | 'typeRating'
  >): Promise<true> => {
    let result = await $fetch(`/api/ratings/${ratingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ratingId,
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

  // Delete rating
  deleteRating: async ({ ratingId }: Pick<RatingType, 'ratingId'>): Promise<true> => {
    let result = await $fetch(`/api/ratings/${ratingId}`, {
      method: 'DELETE',
      body: JSON.stringify({ ratingId }),
    });
    return await result.json();
  },
};
