export interface FetchType {
  (url: string, params?: RequestInit): Promise<Response>;
}

// Доступ к $fetch через this в компонетах
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

  let response: any = await fetch(url, params);

  if (response && response.status >= 400 && response.status <= 600) {
    console.error(response);
    throw new Error(response);
  }
  return response;
};

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$fetch = $fetch;
  },
};
