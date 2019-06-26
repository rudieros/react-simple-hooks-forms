import { DEFAULT_FORM_NAME } from './defaultFormName'
import { ValidateOnOptions, ValidateOrderOptions, ValidationOptions } from '../types/FormInputProps'

let Defaults = {
  formName: DEFAULT_FORM_NAME,
  validationOptions: {
    on: ValidateOnOptions.BLUR,
    order: ValidateOrderOptions.AFTER_MASK,
  } as ValidationOptions
}

export const setDefaults = (defaults: typeof Defaults) => {
  Defaults = {
    ...Defaults,
    ...defaults,
  }
}

export const getDefaults = () => Defaults
