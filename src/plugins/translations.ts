import { LangType } from '@/types';
export interface TranslationsType {
  (key: string): string;
}

export let $langs: LangType = {
  ua: '',
  ru: '',
};

export let $langsInit = (): LangType => $langs;

export let $lang: keyof LangType = 'ua';

export let $t = (key: string): string => {
  return key || '';
};

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: TranslationsType;
    $langs: LangType;
    $lang: keyof LangType;
    $langsInit: typeof $langsInit;
  }
}

let translations = {
  install: (app: any) => {
    app.config.globalProperties.$t = $t;
    app.config.globalProperties.$langs = $langs;
    app.config.globalProperties.$lang = $lang;
    app.config.globalProperties.$langsInit = $langsInit;
  },
};

export default translations;
