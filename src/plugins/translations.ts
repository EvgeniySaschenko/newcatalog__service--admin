import { LangType, ServicesEnum } from '@/types';
import cookies from 'vue-cookies';
export interface $tType {
  (key: string): string;
}

type TranslationsListType = Record<keyof LangType, Record<string, string>>;

type ServicesLang = keyof Pick<typeof ServicesEnum, 'admin' | 'site'>;

/* 
  !!! The correct list of languages and the default language will be obtained from the server from the application settings !!!
*/

// Lang default
let langDefaultServices: Record<ServicesLang, keyof LangType> = {
  admin: 'en',
  site: 'en',
};

// Langs
let langsServices: Record<ServicesLang, LangType> = {
  admin: {
    en: '',
  },
  site: {
    en: '',
  },
};

// Translations list
let translationsList = {} as unknown as TranslationsListType;

export let langNameCookie = 'lang';

// JSON.parse(JSON.stringify( -- Because objects are copied by reference

// Get langs
export let $langs = (type: ServicesLang): LangType => {
  return JSON.parse(JSON.stringify(langsServices[type]));
};

// Get lang default
export let $langDefault = (type: ServicesLang): keyof LangType => {
  return JSON.parse(JSON.stringify(langDefaultServices[type]));
};

// Set langs app
export function $setLangs({ langs, type }: { langs: LangType; type: ServicesLang }) {
  langsServices[type] = langs;
}

// Set lang default app
export function $setLangDefault({ lang, type }: { lang: keyof LangType; type: ServicesLang }) {
  langDefaultServices[type] = lang;
}

// Set lang default local (admin cookie-based)
export function $setLangDefaultLocal({ lang }: { lang: keyof LangType }) {
  let langCookie = (cookies as any).get(langNameCookie);
  let isExistInList = Object.keys($langs(ServicesEnum.admin)).includes(langCookie);

  if (!isExistInList) {
    (cookies as any).remove(langNameCookie);
  } else {
    lang = langCookie;
  }
  $setLangDefault({ lang, type: ServicesEnum.admin });
}

// Set cookie lang default local (admin)
export function $setCokieLangDefaultLocal({ lang }: { lang: keyof LangType }) {
  let isExistInList = Object.keys($langs(ServicesEnum.admin)).includes(lang);
  if (!isExistInList) return;
  (cookies as any).set(langNameCookie, lang, '365d');
}

// Set lang default app
export function $setTranslationsList({ translations }: { translations: any }) {
  translationsList = translations;
}

// Function translation
export let $t = (key: string): string => {
  let lang = langDefaultServices[ServicesEnum.admin];
  if (!translationsList[lang]) return key;
  return translationsList[lang][key] || key;
};

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: $tType;
    $langs: typeof $langs;
    $langDefault: typeof $langDefault;
    $setLangs: typeof $setLangs;
    $setLangDefault: typeof $setLangDefault;
    $setLangDefaultLocal: typeof $setLangDefaultLocal;
    $setCokieLangDefaultLocal: typeof $setCokieLangDefaultLocal;
    $setTranslationsList: typeof $setTranslationsList;
  }
}

let install = {
  install: (app: any) => {
    app.config.globalProperties.$t = $t;
    app.config.globalProperties.$langs = $langs;
    app.config.globalProperties.$langDefault = $langDefault;
    app.config.globalProperties.$setLangs = $setLangs;
    app.config.globalProperties.$setLangDefault = $setLangDefault;
    app.config.globalProperties.$setLangDefaultLocal = $setLangDefaultLocal;
    app.config.globalProperties.$setCokieLangDefaultLocal = $setCokieLangDefaultLocal;
    app.config.globalProperties.$setTranslationsList = $setTranslationsList;
  },
};

export default install;
