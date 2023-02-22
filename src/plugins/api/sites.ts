import { $fetch, $utils } from './_core';
import {
  RatingItemType,
  RatingType,
  SiteScreenshotType,
  SiteType,
  SiteLogoScreenshotParamsType,
} from '@/types';

export default {
  // Get one site
  getSiteBySiteId: async ({ siteId }: { siteId: SiteType['siteId'] }) => {
    let result = await $fetch(`/api/sites/${siteId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Get screenshots for sites no logo
  getSitesSreens: async ({ ratingId }: { ratingId: RatingType['ratingId'] }) => {
    let result = await $fetch(`/api/sites/screenshots/${ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Get sites with screenshot error
  getScrenshotsErrors: async ({ ratingId }: { ratingId: RatingType['ratingId'] }) => {
    let result = await $fetch(`/api/sites/screenshots-errors/${ratingId}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Create site screenshot
  createSiteScreenshot: async ({
    siteId,
    url,
  }: {
    siteId: RatingItemType['siteId'];
    url: RatingItemType['url'];
  }) => {
    let result = await $fetch(`/api/sites/screenshot-create`, {
      method: 'POST',
      body: JSON.stringify({
        siteId,
        url,
      }),
    });
    return await result.json();
  },

  // Update sites color
  editSitesColor: async ({
    siteScreenshotId,
    color,
  }: {
    siteScreenshotId: RatingItemType['siteScreenshotId'];
    color: RatingItemType['color'];
  }) => {
    let result = await $fetch(`/api/sites/color`, {
      method: 'PUT',
      body: JSON.stringify({
        siteScreenshotId,
        color,
      }),
    });
    return await result.json();
  },

  // Create logo site
  createSiteLogo: async ({
    siteScreenshotId,
    color,
    logoScreenshotParams,
  }: {
    siteScreenshotId: SiteScreenshotType['siteScreenshotId'];
    color: SiteType['color'];
    logoScreenshotParams: SiteLogoScreenshotParamsType['logoScreenshotParams'];
  }) => {
    let result = await $fetch(`/api/sites/logo-create`, {
      method: 'PUT',
      body: JSON.stringify({
        siteScreenshotId,
        color,
        logoScreenshotParams,
      }),
    });

    return await result.json();
  },

  // Recreate logo site
  recreateSiteLogo: async ({ siteId }: { siteId: RatingItemType['siteId'] }) => {
    let result = await $fetch(`/api/sites/logo-recreate`, {
      method: 'PUT',
      body: JSON.stringify({
        siteId,
      }),
    });
    return await result.json();
  },

  // Check for a logo or screenshot for a host
  checkImagesForSite: async ({ host }: { host: RatingItemType['domain'] }) => {
    let result = await $fetch(`/api/sites/images-site-check/${host}`, {
      method: 'GET',
    });
    return await result.json();
  },

  // Link domain images to subdomain
  linkDomainImagesToSubdomain: async ({
    domainSiteId,
    subdomainSiteId,
  }: {
    domainSiteId: SiteType['siteId'];
    subdomainSiteId: RatingItemType['siteId'];
  }) => {
    let result = await $fetch(`/api/sites/images-domain-to-subdomain`, {
      method: 'PUT',
      body: JSON.stringify({
        domainSiteId,
        subdomainSiteId,
      }),
    });
    return await result.json();
  },

  // Upload custom screenshot
  uploadCustomSiteScreenshot: async ({
    siteId,
    screenshotFile,
  }: {
    siteId: RatingItemType['siteId'];
    screenshotFile: File;
  }) => {
    let data = new FormData();
    data.append('screenshotFile', screenshotFile);
    data.append('siteId', JSON.stringify(siteId));

    let result = await $fetch(`/api/sites/screenshot-custom`, {
      method: 'POST',
      headers: {},
      body: data,
    });

    return await result.json();
  },
};
