import objectPath from 'object-path'
import { DEFAULT_FORM_NAME } from '../constants/defaultFormName'
import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import { ValidationOrder, ValidationTrigger } from '../types/FormInputProps'
import { buildOnChangeError } from './buildOnChangeError'
import { FieldRegistration } from '../types/FieldRegistration'
import { FormType } from '../types/FormType'
import { getFormFieldRegistration, getFormFieldRegistrationSubfields } from './formFieldRegistrationHelpers'

export const buildOnChangeValue = (config: {
  formName?: string
  fieldName: string
}) => (value: any) => {
  const {
    formName,
    fieldName,
  } = { formName: DEFAULT_FORM_NAME, ...config }
  const boundingForm = Form[formName]

  const fieldRegistration = getFormFieldRegistration(formName, fieldName)
  const {
    changeListener,
    fieldName: fieldRegistrationFieldName,
  } = fieldRegistration

  let finalValue = value

  validateValue(finalValue, ValidationOrder.BEFORE_MASK, formName, fieldRegistration)
  finalValue = applyMask(finalValue, fieldRegistration)
  validateValue(finalValue, ValidationOrder.AFTER_MASK, formName, fieldRegistration)

  objectPath.set(boundingForm.values, fieldName, finalValue)
  boundingForm.dirty = true
  changeListener(finalValue)
  if (shouldBubbleEvent(boundingForm, fieldRegistration)) {
    bubbleUp(fieldName, formName)
    bubbleDown(fieldName, formName)
  }
  Object.values((FormFieldSubscriptions[formName][fieldName] || {}).changeListenerSubscribers || {})
    .forEach((listener) => listener(finalValue))
}

const bubbleUp = (fieldName: string, formName: string) => {
  const boundingForm = Form[formName]
  const value = getFormFieldRegistrationSubfields(formName, fieldName)
  if (typeof value === 'object') {
    Object.keys(value).forEach((candidateSubfield) => {
      if (candidateSubfield === '__fieldRegistration') {
        return
      }
      const possibleFieldRegistrationKey = `${fieldName}.${candidateSubfield}`
      const fieldRegistration = getFormFieldRegistration(formName, possibleFieldRegistrationKey)
      fieldRegistration?.changeListener?.(objectPath.get(boundingForm.values, possibleFieldRegistrationKey))
      bubbleUp(possibleFieldRegistrationKey, formName)
    })
  }
}

const bubbleDown = (fieldName: string, formName: string) => {
  const boundingForm = Form[formName]
  const allParentFields = fieldName.split('.')
  if (allParentFields.length > 1) {
    const possibleParentFieldRegistrationKey = allParentFields.slice(0, -1).join('.')
    const fieldRegistration = getFormFieldRegistration(formName, possibleParentFieldRegistrationKey)
    fieldRegistration?.changeListener?.(objectPath.get(boundingForm.values, possibleParentFieldRegistrationKey))
    bubbleDown(possibleParentFieldRegistrationKey, formName)
  }
}

const shouldBubbleEvent = (form: FormType, fieldRegistration: FieldRegistration) => {
  return fieldRegistration.enableEventBubbling ?? form.enableEventBubbling
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
  order: ValidationOrder,
  formName: string,
  fieldRegistration: FieldRegistration,
) => {
  const {
    validationOptions,
    validator,
    fieldName,
  } = fieldRegistration
  if (
    validationOptions
    && validationOptions.order === order
    && validationOptions.trigger === ValidationTrigger.ON_CHANGE
    && typeof validator === 'function'
  ) {
    const error = validator(value)
    buildOnChangeError({ formName, fieldName })(error)
  }
}
