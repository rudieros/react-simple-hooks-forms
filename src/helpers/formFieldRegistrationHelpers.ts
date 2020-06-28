import objectPath from 'object-path'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FieldRegistration } from '../types/FieldRegistration'

const formFieldRegistrationKey = '__fieldRegistration'

export const setFormFieldRegistration = (formName: string, fieldName: string, value: FieldRegistration) => {
  objectPath.set(FormFieldRegistry, `${formName}.${fieldName}.${formFieldRegistrationKey}`, value)
}

export const getFormFieldRegistration = (formName: string, fieldName: string) => {
  return objectPath.get(FormFieldRegistry, `${formName}.${fieldName}.${formFieldRegistrationKey}`) as FieldRegistration
}

export const getFormFieldRegistrationSubfields = (formName: string, fieldName: string) => {
  return objectPath.get(FormFieldRegistry, `${formName}.${fieldName}`)
}

export const forEachFieldRegistration = (formName: string, callback: (registration: FieldRegistration) => any, fieldName = '') => {
  const thisRegistration = getFormFieldRegistration(formName, fieldName)
  thisRegistration && callback(thisRegistration)
  const value = getFormFieldRegistrationSubfields(formName, fieldName)
  if (typeof value === 'object') {
    Object.keys(value).forEach((candidateSubfield) => {
      if (candidateSubfield === formFieldRegistrationKey) {
        return
      }
      const possibleFieldRegistrationKey = `${fieldName}${fieldName !== '' ? '.' : ''}${candidateSubfield}`
      forEachFieldRegistration(formName, callback, possibleFieldRegistrationKey)
    })
  }
}
