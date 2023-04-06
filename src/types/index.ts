import { LangsListType } from './langs-list';

export type ValueOfType<T> = T[keyof T];

// App types (for short entry in translations)
export enum ServicesShortEnum {
  site = 'site',
  admin = 'admin',
}

// Services types
export enum ServicesEnum {
  api = 'service--api',
  admin = 'service--admin',
  site = 'service--site',
}
export type ServicesType = ServicesEnum.api | ServicesEnum.admin | ServicesEnum.site;

// Lang
export type AppType = keyof typeof ServicesShortEnum;
export type LangType = LangsListType;

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
export enum SettingsEnum {
  adminLang = 'admin-lang-default',
  adminLangs = 'admin-langs',
  siteLang = 'site-lang-default',
  siteLangs = 'site-langs',
}

export type SettingsType = {
  [SettingsEnum.adminLang]: keyof LangType;
  [SettingsEnum.adminLangs]: (keyof LangType)[];
  [SettingsEnum.siteLang]: keyof LangType;
  [SettingsEnum.siteLangs]: (keyof LangType)[];
};

export type SettingsLangDefaultType = {
  type: SettingsEnum.adminLang | SettingsEnum.siteLang;
  lang: SettingsType[SettingsEnum.adminLang] | SettingsType[SettingsEnum.siteLang];
};

export type SettingsLangsListType = {
  type: SettingsEnum.adminLangs | SettingsEnum.siteLangs;
  langs: SettingsType[SettingsEnum.adminLangs] | SettingsType[SettingsEnum.siteLangs];
};

// Translation
export type TranslationType = {
  translationId: number;
  text: LangType;
  key: string;
};

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
