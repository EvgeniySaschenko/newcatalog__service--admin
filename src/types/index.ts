export type ValueOfType<T> = T[keyof T];

// Lang
export type LangType = {
  ua: string;
  ru: string;
};

// Pagination
export type PaginationType = {
  page: number;
  itemsCount: number;
  maxRecordsPerPage: number;
  pagesCount: number;
};

// Settings langs iso
export type LangsIsoType = {
  code: string;
  name: string;
};

// Settings
export type SettingsType = {
  'admin-lang-default': keyof LangType;
  'admin-langs': [keyof LangType][];
  'site-lang-default': keyof LangType;
  'site-langs': [keyof LangType][];
};

export type SettingsLangDefaultType = {
  name: keyof SettingsType['admin-lang-default'] | keyof SettingsType['site-lang-default'];
  lang: SettingsType['admin-lang-default'] | SettingsType['site-lang-default'];
};

export type SettingsLangsListType = {
  name: keyof SettingsType['admin-langs'] | keyof SettingsType['site-langs'];
  langs: SettingsType['admin-langs'] | SettingsType['site-langs'];
};

// Translation
export type TranslationType = {
  translationId: number;
  text: LangType;
  key: string;
};

// Translation types
export type TranslationTypeNameType = 'service--api' | 'service--admin' | 'service--site';

// Section
export type SectionType = {
  sectionId: number;
  isHiden: boolean;
  name: LangType;
  priority: number;
};

// Rating

export enum RatingTypeTypeEnum {
  site = '1',
}

export enum RatingDisplayTypeEnum {
  tile = '1',
  inline = '2',
}

export enum RatingSortTypeEnum {
  alexa = '1',
  click = '2',
}

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
  screenshotImg: string;
};

// Rating
export type RatingType = {
  userId: number;
  ratingId: number;
  isHiden: boolean;
  descr: LangType;
  name: LangType;
  sectionsIds: object;
  typeDisplay: RatingDisplayTypeEnum;
  typeRating: RatingTypeTypeEnum;
  typeSort: RatingSortTypeEnum;
  dateCreate?: Date;
  dateCacheCreation: Date | null;
  dateFirstPublication: Date | null;
  countRatingItemsTotal: number;
  countRatingItemsHidden: number;
};

// Rating item
export type RatingItemType = {
  ratingItemId: number;
  siteScreenshotId: number;
  isHiden: boolean;
  labelsIds: object;
  name: LangType;
  siteId: number;
  priority: number;
  ratingId: number;
  url: string;
  domain: string;
  color: string;
};

// Label
export type LabelType = {
  labelId: number;
  name: LangType;
  color: string;
  ratingId: number;
};
