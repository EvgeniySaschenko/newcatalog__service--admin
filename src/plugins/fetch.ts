import { $t } from '@/plugins/translations';
import { $config } from '@/plugins/config';

export interface FetchType {
  (url: string, params?: RequestInit): Promise<Response>;
}

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $fetch: FetchType;
  }
}

let defaultParams = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export let $fetch: FetchType = async (url: string, params?: RequestInit): Promise<Response> => {
  if (params && params.method !== 'GET') {
    params = Object.assign(defaultParams(), params);
  }
  let response: any;
  try {
    response = await fetch(url, params);
  } catch (error) {
    // Unexpected Errors
    console.error(error);
    throw { server: $t('Server error') };
  }

  switch (response.status) {
    // Data validation errors
    case 400: {
      throw await response.json();
    }
    // If the user is not logged in, redirect to the login page
    case 401: {
      if (window.location.pathname != $config['pages-specific'].login) {
        window.location.href = $config['pages-specific'].login;
      }
      throw { is_not_authorized: $t('User is not authorized') };
    }
    // URL not found
    case 404: {
      throw { server: $t('URL not found on server') };
    }
    // Request Entity Too Large
    case 413: {
      throw { server: $t('Request Entity Too Large') };
    }
    // The server is not ready to process requests
    case 503: {
      throw {
        server: $t('The server is not ready to process requests, an update is in progress'),
      };
    }

    default: {
      if (response.status > 400) {
        // Other server errors
        let message = (await response.json())?.server || $t('Server error');
        throw { server: message };
      }
    }
  }

  return response;
};

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$fetch = $fetch;
  },
};
