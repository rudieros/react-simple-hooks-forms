import { DEFAULT_FORM_NAME } from './defaultFormName'
import { ValidationTrigger, ValidationOrder, ValidationOptions } from '../types/FormInputProps'

let Defaults = {
  formName: DEFAULT_FORM_NAME,
  validationOptions: {
    trigger: ValidationTrigger.BLUR,
    order: ValidationOrder.AFTER_MASK,
  } as ValidationOptions
}

export const setDefaults = (defaults: typeof Defaults) => {
  Defaults = {
    ...Defaults,
    ...defaults,
  }
}

export const getDefaults = () => Defaults

export const getDefaultFormName = () => Defaults.formName
