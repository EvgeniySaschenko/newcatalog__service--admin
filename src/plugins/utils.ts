import { $t } from '@/plugins/translations';
import { ElMessage, ElMessageBox } from 'element-plus';
import { $config } from '@/plugins/config';

// Tell TypeScript that this property is global i.e. available in components via "this"
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utils: typeof $utils;
  }
}

export let $utils = {
  /*
    Date formatting
  */
  date(date: Date | null, format?: string) {
    if (!date) return '-';

    let options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    } as const;

    switch (format) {
      case 'datetime':
        Object.assign(options, { hour: 'numeric', minute: 'numeric' });
        break;
    }

    return new Intl.DateTimeFormat($config['date'].dateTimeFormat, options).format(new Date(date));
  },
  /*
    Show confirmation dialog
  */
  showDialogConfirm({
    title = '',
    message = '',
    confirmButtonText = $t('Yes'),
    cancelButtonText = $t('No'),
  }) {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type: 'warning',
    });
  },
  /*
    Show alert dialog
  */
  showDialogAlert({ title = '', message = '', confirmButtonText = $t('OK') }) {
    return ElMessageBox.alert(message, title, {
      confirmButtonText,
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
  showMessageError({ duration = 0, showClose = true, message = '', errors = undefined }) {
    if (!message) {
      message = $t('Unexpected error');
      console.error(errors || $t('Unexpected error'));
    }
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
    isForce - If the value is true, add add an error message even if the rkey was not previously in the object
    Adds error messages to "targetObject" if fields are present in "targetObject" and "keysErrors"
  */
  setErrors(
    targetObject: Record<string, string>,
    keysErrors: Record<string, string>,
    isForce = false
  ) {
    let isValidationError = false;
    for (let key in keysErrors) {
      if (key in targetObject || isForce) {
        isValidationError = true;
        targetObject[key] = keysErrors[key];
      }
    }
    return isValidationError;
  },
  /* 
    targetObject - mutable object
    keysErrors - Object containing the keys to be changed
    Clear error messages to "targetObject" if fields are present in "targetObject" and "keysErrors"
  */
  clearErrors(targetObject: Record<string, string>, keysErrors: Record<string, string>) {
    for (let key in keysErrors) {
      if (key in targetObject) {
        targetObject[key] = '';
      }
    }
  },
};

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$utils = $utils;
  },
};
