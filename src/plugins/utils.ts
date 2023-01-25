export let $utils = {
  /* 
    Возваращает объект с ссобщениями об ошибках
    errors - объект с ошибками
    errorsTarget - на основе этого объекта определяются допустимые поля
  */
  setErrors<T1 extends object, T2 extends object>(errorsMsg: T1, errorsTarget: T2): object {
    let errorsMsgResult: Record<string, any> = {};

    if (errorsMsg instanceof Error && 'server' in errorsTarget) {
      errorsMsgResult = { server: 'Ошибка сервера' };
    } else {
      for (let key in errorsMsg) {
        if (key in errorsTarget) {
          errorsMsgResult[key] = errorsMsg[key];
        }
      }
    }

    return errorsMsgResult;
  },
  /* 
    Возваращает объект с в котором значения полей будут заменены на пустую строку
    errorsTarget - на основе этого объекта определяются допустимые которые будут в объекте
  */
  clearErrors(errorsTarget: object) {
    let errorsClear: any = {};
    for (let key in errorsTarget) {
      errorsClear[key] = '';
    }
    return errorsClear;
  },

  /*
    Преобразовать object в строку QueryParams
  */
  convertToQueryParams<T extends object>(obj: T): string {
    let query: string[] = [];
    let key: keyof T;

    for (key in obj) {
      let value = String(obj[key]).trim();
      if (value !== '' && value !== 'undefined' && typeof key === 'string') {
        query.push(`${key}=${value}`);
      }
    }
    return query.join('&');
  },
};

// Доступ к $errors через this в компонетах
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utils: typeof $utils;
  }
}

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$utils = $utils;
  },
};
