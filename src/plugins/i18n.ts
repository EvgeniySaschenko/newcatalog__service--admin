export interface I18nType {
  (key: string): string;
}

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: I18nType;
  }
}

export let $t = (key: string): string => {
  return key || '';
};

let i18n = {
  install: (app: any) => {
    app.config.globalProperties.$t = $t;
  },
};

export default i18n;
