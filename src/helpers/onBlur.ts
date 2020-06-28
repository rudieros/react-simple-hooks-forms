import objectPath from 'object-path'
import { Form } from '../Form'
import { ValidationTrigger } from '../types/FormInputProps'
import { buildOnChangeError } from './buildOnChangeError'
import { FieldRegistration } from '../types/FieldRegistration'
import { getDefaults } from '../constants/defaults'
import { getFormFieldRegistration } from './formFieldRegistrationHelpers'

export const onBlur = (config: {
  formName?: string
  fieldName: string
}) => () => {
  const {
    formName,
    fieldName,
  } = { formName: getDefaults().formName, ...config }

  const fieldRegistration = getFormFieldRegistration(formName, fieldName)
  if (fieldRegistration.validationOptions.trigger !== ValidationTrigger.BLUR) {
    return
  }

  const fieldValue = objectPath.get(Form[formName].values, fieldName)
  validateValue(fieldValue, formName, fieldRegistration)
}

const validateValue = (
  value: any,
  formName: string,
  fieldRegistration: FieldRegistration,
) => {
  const {
    validator,
    fieldName,
  } = fieldRegistration
  if (typeof validator === 'function') {
    const error = validator(value)
    buildOnChangeError({ formName, fieldName })(error)
  }
}
