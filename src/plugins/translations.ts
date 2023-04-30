import { LangType, ServicesTranslationsType, TranslationsMapType, ServicesEnum } from '@/types';
import cookies from 'vue-cookies';
import { $config } from '@/plugins/config';

/* 
  !!! The correct list of languages and the default language will be obtained from the server from the application settings !!!
*/

// JSON.parse(JSON.stringify( -- Because objects are copied by reference

/*
  Lang default  
*/
let langDefaultValues = JSON.parse(JSON.stringify($config['translations'].langDefault));
let langDefaultServices: Record<ServicesTranslationsType, keyof LangType> = langDefaultValues;

// Get
export let $langDefault = (serviceName: ServicesTranslationsType): keyof LangType => {
  return JSON.parse(JSON.stringify(langDefaultServices[serviceName]));
};

// Set
type $setLangDefault = {
  langDefault: keyof LangType;
  serviceName: ServicesTranslationsType;
};

let langDefaultCookieName = $config['translations'].langDefaultCookieName;
let langDefaultCookieAge = $config['translations'].langDefaultCookieAge;

export function $setLangDefault({ langDefault, serviceName }: $setLangDefault) {
  // If admin, we try to set the language based on cookies
  if (ServicesEnum.admin === serviceName) {
    let langCookie = (cookies as any).get(langDefaultCookieName);
    let isExistInList = Object.keys($langs(ServicesEnum.admin)).includes(langCookie);

    if (!isExistInList) {
      (cookies as any).remove(langDefaultCookieName);
    } else {
      langDefault = langCookie;
    }
  }

  langDefaultServices[serviceName] = langDefault;
}

// Set cookie
export function $setCokieLangDefault({ langDefault }: { langDefault: keyof LangType }) {
  let isExistInList = Object.keys($langs(ServicesEnum.admin)).includes(langDefault);
  if (!isExistInList) return;
  (cookies as any).set(langDefaultCookieName, langDefault, langDefaultCookieAge);
}

/*
  Langs
*/
let langsValues = JSON.parse(JSON.stringify($config['translations'].langs));
let langsServices: Record<ServicesTranslationsType, LangType> = langsValues;

// Get
export let $langs = (serviceName: ServicesTranslationsType): LangType => {
  return JSON.parse(JSON.stringify(langsServices[serviceName]));
};

// Set
type $setLangsType = {
  langs: LangType;
  serviceName: ServicesTranslationsType;
};

export function $setLangs({ langs, serviceName }: $setLangsType) {
  langsServices[serviceName] = langs;
}

/* 
  Translations map
*/

let translationsMap = {} as unknown as TranslationsMapType;

// Set translations
export function $setTranslations({ translations }: { translations: TranslationsMapType }) {
  translationsMap = translations;
}

// Function translation
interface $tType {
  (key: string): string;
}

export let $t = (key: string): string => {
  let lang = langDefaultServices[ServicesEnum.admin];
  if (!translationsMap[lang]) return key;
  return translationsMap[lang][key] || key;
};

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: $tType;
    $langs: typeof $langs;
    $langDefault: typeof $langDefault;
    $setLangs: typeof $setLangs;
    $setLangDefault: typeof $setLangDefault;
    $setCokieLangDefault: typeof $setCokieLangDefault;
    $setTranslations: typeof $setTranslations;
  }
}

let install = {
  install: (app: any) => {
    app.config.globalProperties.$t = $t;
    app.config.globalProperties.$langs = $langs;
    app.config.globalProperties.$langDefault = $langDefault;
    app.config.globalProperties.$setLangs = $setLangs;
    app.config.globalProperties.$setLangDefault = $setLangDefault;
    app.config.globalProperties.$setCokieLangDefault = $setCokieLangDefault;
    app.config.globalProperties.$setTranslations = $setTranslations;
  },
};

export default install;
