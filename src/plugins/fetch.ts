export interface FetchType {
  (url: string, params?: RequestInit): Promise<Response>;
}

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $fetch: FetchType;
  }
}

// Доступ к $fetch через this в "pinia"
// declare module 'pinia' {
//   interface PiniaCustomProperties {
//     $fetch: FetchType;
//   }
// }

let defaultParams = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export let $fetch: FetchType = async (url: string, params?: RequestInit): Promise<Response> => {
  if (params && params.method !== 'GET') {
    params = Object.assign(defaultParams, params);
  }
  let response: any;
  try {
    response = await fetch(url, params);
  } catch (error) {
    // Unexpected Errors
    console.error(error);
    throw { server: 'Ошибка сервера' };
  }
  if (response.status == 400) {
    // Data validation errors
    throw await response.json();
  } else if (response.status > 400) {
    // Other server errors
    console.error(response);
    if (response.json) {
      console.error(await response?.json());
    }
    throw await { server: 'Ошибка сервера' };
  }
  return response;
};

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$fetch = $fetch;
  },
};