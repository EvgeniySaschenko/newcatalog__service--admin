import { LangsListType } from './langs-list';

export type ValueOfType<T> = T[keyof T];

// Lang
export type LangType = Partial<LangsListType>;

// Langs iso
export type LangsIsoType = {
  code: keyof LangType;
  name: string;
};

// Translation
export type TranslationType = {
  translationId: number;
  text: LangType;
  key: string;
};

export type TranslationsMapType = Record<keyof LangType, Record<string, string>>;

// Services
export enum ServicesEnum {
  api = 'api',
  admin = 'admin',
  site = 'site',
}

// The languages of these services are used in the admin interface
export type ServicesTranslationsType = 'admin' | 'site';

// All services
export type ServicesType = keyof typeof ServicesEnum;

// Services that have languages (There may be other services)
export type ServicesLangsType = keyof Pick<typeof ServicesEnum, 'site' | 'admin' | 'api'>;

// Used as shorthand
type ServiceSiteType = keyof Pick<typeof ServicesEnum, 'site'>;
type ServiceAdminType = keyof Pick<typeof ServicesEnum, 'admin'>;
type ServiceApiType = keyof Pick<typeof ServicesEnum, 'api'>;

// Settings
export enum SettingsEnum {
  // langs
  langDefault = 'langDefault',
  langs = 'langs',
  // images
  imageAppFavicon = 'imageAppFavicon',
  imageAppPreloader = 'imageAppPreloader',
  imageAppLogo = 'imageAppLogo',
  imageAppDefault = 'imageAppDefault',
  // colors
  colorBodyBackground = 'colorBodyBackground',
  colorPrimary = 'colorPrimary',
  colorPrimaryInverted = 'colorPrimaryInverted',
  colorTextRegular = 'colorTextRegular',
  colorSelectionBackground = 'colorSelectionBackground',
  colorSelectionText = 'colorSelectionText',
  // Code / text
  headScript = 'headScript',
  headStyles = 'headStyles',
  headerInfoHtml = 'headerInfoHtml',
  headerHtml = 'headerHtml',
  contentTopHtml = 'contentTopHtml',
  contentBottomHtml = 'contentBottomHtml',
  footerHtml = 'footerHtml',
  // Marketing
  pageTitlePrefix = 'pageTitlePrefix',
  pageTitleSufix = 'pageTitleSufix',
  googleTagManagerId = 'googleTagManagerId',
  // Backup
  backup = 'backup',
  // Oher
  protector = 'protector',
}

export enum SettingsBackupEnum {
  host = 'host',
  username = 'username',
  publicKey = 'publicKey',
  publicKeyComment = 'publicKeyComment',
  port = 'port',
  remoteDir = 'remoteDir',
}

export enum SettingsProtectorEnum {
  url = 'url',
  textKey = 'textKey',
}

export type SettingsType = {
  // langs
  [SettingsEnum.langDefault]: Record<ServicesLangsType, keyof LangType>;
  [SettingsEnum.langs]: Record<ServicesLangsType, (keyof LangType)[]>;
  // images
  [SettingsEnum.imageAppFavicon]: Record<ServiceAdminType | ServiceSiteType, string>;
  [SettingsEnum.imageAppPreloader]: Record<ServiceAdminType | ServiceSiteType, string>;
  [SettingsEnum.imageAppLogo]: Record<ServiceAdminType | ServiceSiteType, string>;
  [SettingsEnum.imageAppDefault]: Record<ServiceAdminType | ServiceSiteType, string>;
  // colors
  [SettingsEnum.colorBodyBackground]: Record<ServiceSiteType, string>;
  [SettingsEnum.colorPrimary]: Record<ServiceSiteType, string>;
  [SettingsEnum.colorPrimaryInverted]: Record<ServiceSiteType, string>;
  [SettingsEnum.colorTextRegular]: Record<ServiceSiteType, string>;
  [SettingsEnum.colorSelectionBackground]: Record<ServiceSiteType, string>;
  [SettingsEnum.colorSelectionText]: Record<ServiceSiteType, string>;
  // Code / text
  [SettingsEnum.headScript]: Record<ServiceSiteType, string>;
  [SettingsEnum.headStyles]: Record<ServiceSiteType, string>;
  [SettingsEnum.headerInfoHtml]: Record<ServiceAdminType | ServiceSiteType, string>;
  [SettingsEnum.headerHtml]: Record<ServiceSiteType, string>;
  [SettingsEnum.contentBottomHtml]: Record<ServiceSiteType, string>;
  [SettingsEnum.contentTopHtml]: Record<ServiceSiteType, string>;
  [SettingsEnum.footerHtml]: Record<ServiceSiteType, string>;
  // Seo / Marketing
  [SettingsEnum.pageTitlePrefix]: Record<ServiceSiteType, string>;
  [SettingsEnum.pageTitleSufix]: Record<ServiceSiteType, string>;
  [SettingsEnum.googleTagManagerId]: Record<ServiceSiteType, string>;
  // Backup
  [SettingsEnum.backup]: Record<
    ServiceApiType,
    {
      [SettingsBackupEnum.host]: string;
      [SettingsBackupEnum.username]: string;
      [SettingsBackupEnum.publicKey]: string;
      [SettingsBackupEnum.publicKeyComment]: string;
      [SettingsBackupEnum.port]: number;
      [SettingsBackupEnum.remoteDir]: string;
    }
  >;
  // Other
  [SettingsEnum.protector]: Record<
    ServiceApiType,
    {
      [SettingsProtectorEnum.url]: string;
      [SettingsProtectorEnum.textKey]: string;
    }
  >;
};

export type SettingsServicesType = {
  settingName: string;
  settingValue: any;
  serviceName: keyof typeof ServicesEnum;
};

export type SettingsExtendsType = {
  [SettingsEnum.imageAppFavicon]: Record<'mimeTypes', string>[];
  [SettingsEnum.imageAppPreloader]: Record<'mimeTypes', string>[];
  [SettingsEnum.imageAppLogo]: Record<'mimeTypes', string>[];
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
  siteLogoId: number;
  siteScreenshotId: number;
  color: string;
  dateLogoCreate: Date;
};

// Site screenshot
export type SiteScreenshotType = {
  siteScreenshotId: number;
  screenshotImg: string;
  host: string;
};

// Site screenshot error
export type SiteScreenshotErrorType = {
  dateScreenshotError: Date;
  siteScreenshotId: number;
  url: string;
};

// Rating
export type RatingType = {
  ratingId: number;
  isHiden: boolean;
  descr: LangType;
  name: LangType;
  sectionsIds: Record<string, number>;
  typeDisplay: RatingDisplayTypeEnum;
  typeRating: RatingTypeTypeEnum;
  typeSort: RatingSortTypeEnum;
  dateCreate?: Date;
  dateCacheCreation: Date | null;
  dateFirstPublication: Date | null;
  countRatingItemsTotal: number;
  countRatingItemsHidden: number;
  linksToSources: string[];
};

// Rating item
export type RatingItemType = {
  ratingItemId: number;
  siteScreenshotId: number;
  isHiden: boolean;
  labelsIds: Record<string, number>;
  name: LangType;
  siteId: number;
  priority: number;
  ratingId: number;
  url: string;
  domain: string;
  color: string;
};

export type RatingsListItemType = Pick<
  RatingType,
  | 'descr'
  | 'isHiden'
  | 'name'
  | 'ratingId'
  | 'sectionsIds'
  | 'dateCacheCreation'
  | 'dateFirstPublication'
>;

// Label
export type LabelType = {
  labelId: number;
  name: LangType;
  color: string;
  ratingId: number;
};

// Pagination
export type PaginationType = {
  page: number;
  itemsCount: number;
  maxRecordsPerPage: number;
  pagesCount: number;
};

// Backup
export type BackupType = {
  backupId: number;
  report: any;
  dateCreate: Date;
  isError: boolean;
};
