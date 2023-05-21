import { LangType, ServicesTranslationsType } from '@/types';

export let $config = {
  // date
  date: {
    dateTimeFormat: 'uk',
  },

  // main-menu - Url will be taken from the router
  'main-menu': ['Ratings list', 'Sections list', 'Panel control', 'User profile', 'Settings'],

  // pages-specific
  'pages-specific': {
    // The page the user will be directed to after logging in
    default: '/ratings',
    // Login page
    login: '/login',
    // Ratings page
    ratings: '/ratings',
  },

  // user
  user: {
    // Time after which it is necessary to refresh the token (sec)
    refreshTockenTime: 180,
    // If the user has been idle this time, you must log out (sec)
    idleTime: 900,
  },

  // images
  images: {
    screenshotMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },

  // sites
  sites: {
    // Labels max quantity
    labelsLimitMax: 5,
  },

  // labels
  labels: {
    colorDefault: '#5a448d',
    colorsListDefault: [
      '#5a448d',
      '#E94B3C',
      '#409EFF',
      '#67C23A',
      '#E6A23C',
      '#F56C6C',
      '#909399',
      '#e91e63',
      '#9c27b0',
      '#009688',
      '#357a38',
      '#4780ad',
      '#4615b2',
      '#00FF00',
      '#000000',
      '#ff9100',
      '#003C7A',
      '#800000',
      '#A52A2A',
      '#FFA07A',
      '#0000CD',
      '#DA70D6',
    ],
  },

  // ratings
  ratings: {
    // Labels max quantity
    sectionsLimitMax: 2,
  },

  // translations
  translations: {
    langDefaultCookieName: 'langDefault',
    langDefaultCookieAge: '365d',

    langDefault: {
      admin: 'en',
      site: 'en',
    } as Record<ServicesTranslationsType, keyof LangType>,

    langs: {
      admin: {
        en: '',
      },
      site: {
        en: '',
      },
    } as Record<ServicesTranslationsType, LangType>,
  },
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $config: typeof $config;
  }
}

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$config = $config;
  },
};
