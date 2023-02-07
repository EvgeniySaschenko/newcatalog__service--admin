import { $fetch, $utils } from './_core';
import { SiteType, SiteLogoScreenshotParamsType, SiteScreenshotType } from '@/types';

export default {
  // Get screenshots for sites no logo
  getSitesSreens: async (rating: { ratingId: number }) => {
    let result = await $fetch(`/api/sites/screenshots/${rating.ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create logo site
  createSiteLogo: async ({
    id,
    color,
    logoScreenshotParams,
  }: {
    id: SiteScreenshotType['id'];
    color: SiteType['color'];
    logoScreenshotParams: SiteLogoScreenshotParamsType['logoScreenshotParams'];
  }) => {
    let result = await $fetch(`/api/sites/logo`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        color,
        logoScreenshotParams,
      }),
    });

    return await result.json();
  },
};
