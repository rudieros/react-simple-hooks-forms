import objectPath from 'object-path'
import { DEFAULT_FORM_NAME } from '../constants/defaultFormName'
import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import { ValidateOnOptions, ValidationOptions, ValidateOrderOptions } from '../types/FormInputProps'
import { onChangeError } from './onChangeError'
import { FieldRegistration } from '../types/FieldRegistration'

export const onChangeValue = (config: {
  formName?: string
  fieldName: string
}) => (value: any) => {
  const {
    formName,
    fieldName,
  } = { formName: DEFAULT_FORM_NAME, ...config }

  const fieldRegistration = FormFieldRegistry[formName][fieldName]
  const {
    changeListener,
  } = fieldRegistration

  let finalValue = value

  validateValue(finalValue, ValidateOrderOptions.BEFORE_MASK, formName, fieldRegistration)
  finalValue = applyMask(finalValue, fieldRegistration)
  validateValue(finalValue, ValidateOrderOptions.AFTER_MASK, formName, fieldRegistration)

  objectPath.set(Form[formName].values, fieldName, finalValue)
  Form[formName].dirty = true
  changeListener(finalValue)
  Object.values((FormFieldSubscriptions[formName][fieldName] || {}).changeListenerSubscribers || {})
    .forEach((listener) => listener(finalValue))
}

const applyMask = (value: any, fieldRegistration: FieldRegistration) => {
  const { mask, unmask, saveUnmaskedValue, fieldName } = fieldRegistration
  if (saveUnmaskedValue) {
    if (typeof unmask === 'function') {
      return unmask(value)
    }
    console.warn(`Form field ${fieldName} was set with saveUnmaskedValue = true but no valid unmask function was supplied. This probably leads to unexpected behaviour.`)
    return value
  }
  if (typeof mask === 'function') {
    return mask(value)
  }
  return value
}

const validateValue = (
  value: any,
  order: ValidateOrderOptions,
  formName: string,
  fieldRegistration: FieldRegistration,
) => {
  const {
    validateOptions,
    validate,
    fieldName,
  } = fieldRegistration
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
