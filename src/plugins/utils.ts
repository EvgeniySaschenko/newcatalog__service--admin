import { $t } from '@/plugins/i18n';
import { ElMessage, ElMessageBox } from 'element-plus';

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utils: typeof $utils;
  }
}

export let $utils = {
  /*
    Show deletion confirmation dialog
  */
  showDialogConfirmDelete({
    title = $t('Вы действительно хотите удалить?'),
    message = '',
    confirmButtonText = $t('Да'),
    cancelButtonText = $t('Нет'),
  }) {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type: 'warning',
    });
  },
  /*
    Show success message
    Use to inform the user that an action was successful
    For example "Save section"
  */
  showMessageSuccess({ duration = 3000, showClose = true, message = '' }) {
    ElMessage({
      duration,
      showClose,
      message,
      type: 'success',
    });
  },
  /*
    Show error message
    Use to tell the user when an action failed.
    For example "Server error"
  */
  showMessageError({ duration = 0, showClose = true, message = '' }) {
    ElMessage({
      duration,
      showClose,
      message,
      type: 'error',
    });
  },
  /* 
    targetObject - mutable object
    keysErrors - Object containing the keys to be changed
    Adds error messages to "targetObject" if fields are present in "targetObject" and "keysErrors"
  */
  setErrors(targetObject: any, keysErrors: any) {
    for (let key in keysErrors) {
      if (key in targetObject) {
        targetObject[key] = keysErrors[key];
      }
    }
  },
  /* 
    targetObject - mutable object
    keysErrors - Object containing the keys to be changed
    Clear error messages to "targetObject" if fields are present in "targetObject" and "keysErrors"
  */
  clearErrors(targetObject: any, keysErrors: any) {
    for (let key in keysErrors) {
      if (key in targetObject) {
        targetObject[key] = '';
      }
    }
  },

  /*
    Convert object to string QueryParams
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

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$utils = $utils;
  },
};
