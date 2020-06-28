import { Form } from '../Form'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import objectPath from 'object-path'
import { getDefaults } from '../constants/defaults'
import { getFormFieldRegistration } from './formFieldRegistrationHelpers'

export const buildOnChangeError = (config: {
  formName?: string
  fieldName: string
}) => (error?: string) => {
  const {
    formName,
    fieldName,
  } = { formName: getDefaults().formName, ...config }

  const {
    errorListener,
  } = getFormFieldRegistration(formName, fieldName)

  objectPath.set(Form[formName].errors, fieldName, error)
  errorListener(error)

  Object.values((FormFieldSubscriptions[formName][fieldName] || {} as any).errorListenerSubscribers || {})
    .forEach((listener: any) => listener(error))
}
