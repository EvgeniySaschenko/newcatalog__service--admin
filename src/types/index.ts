// Lang
export type LangType = {
  ua: string;
  ru: string;
};

export let LangInit = (): LangType => {
  return {
    ua: '',
    ru: '',
  };
};

// Section
export type SectionType = {
  sectionId: number;
  isHiden: boolean;
  name: LangType;
  priority: number;
};

// Rating
export type RatingSortType = 'alexa' | 'click';

export type RatingTypeType = 'site';

export type RatingDisplayType = 'tile' | 'inline';

// params - Needed to cut out the logo from the screenshot
export type SiteLogoScreenshotParamsType = {
  logoScreenshotParams: {
    cutHeight: number;
    cutWidth: number;
    imgHeight: number;
    imgWidth: number;
    left: number;
    top: number;
  };
};

// Site
export type SiteType = {
  siteId: number;
  siteScreenshotId: number;
  img: string;
  color: string;
  host: string;
  alexaRank: number;
  dateDomainCreate: Date;
};

// Site screenshot
export type SiteScreenshotType = {
  siteScreenshotId: number;
  img: string;
};

// Rating
export type RatingType = {
  userId: number;
  ratingId: number;
  isHiden: boolean;
  descr: LangType;
  name: LangType;
  sectionsIds: object;
  typeDisplay: RatingDisplayType;
  typeRating: RatingTypeType;
  typeSort: RatingSortType;
  dateCreate?: Date;
};

// Rating item
export type RatingItemType = {
  id: number;
  isCreatedScreen: boolean;
  isHiden: boolean;
  labelsIds: object;
  name: LangType;
  site: SiteType;
  priority: number;
  ratingId: number;
  url: string;
};

// Label
export type LabelType = {
  labelId: number;
  name: LangType;
  color: string;
  ratingId: number;
};
