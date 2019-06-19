import objectPath from 'object-path'
import { DEFAULT_FORM_NAME } from '../constants/defaultFormName'
import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import { ValidateOnOptions, ValidateOptions, ValidateOrderOptions } from '../types/FormInputProps'
import { onChangeError } from './onChangeError'

export const onChangeValue = (config: {
  formName?: string
  fieldName: string
}) => (value: any) => {
  const {
    formName,
    fieldName,
  } = { formName: DEFAULT_FORM_NAME, ...config }

  const {
    mask,
    changeListener,
    validate,
    validateOptions,
  } = FormFieldRegistry[formName][fieldName]

  let finalValue = value

  validateValue(ValidateOrderOptions.BEFORE_MASK, formName, fieldName, finalValue, validate, validateOptions)
  finalValue = applyMask(finalValue, mask)
  validateValue(ValidateOrderOptions.AFTER_MASK, formName, fieldName, finalValue, validate, validateOptions)

  objectPath.set(Form[formName].values, fieldName, finalValue)
  Form[formName].dirty = true
  changeListener(finalValue)
  Object.values((FormFieldSubscriptions[formName][fieldName] || {}).changeListenerSubscribers || {})
    .forEach((listener) => {
      listener(finalValue)
    })
}

const applyMask = (value: any, mask?: (value: any) => any) => {
  if (typeof mask === 'function') {
    return mask(value)
  }
  return value
}

const validateValue = (
  order: ValidateOrderOptions,
  formName: string,
  fieldName: string,
  value: any,
  validate?: (value: any) => any,
  validateOptions?: ValidateOptions
) => {
  if (
    validateOptions
    && validateOptions.order === order
    && validateOptions.on === ValidateOnOptions.REAL_TIME
    && typeof validate === 'function'
  ) {
    const error = validate(value)
    onChangeError({ formName, fieldName })(error)
  }
}