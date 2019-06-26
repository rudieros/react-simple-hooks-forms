import objectPath from 'object-path'
import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { ValidateOnOptions } from '../types/FormInputProps'
import { onChangeError } from './onChangeError'
import { FieldRegistration } from '../types/FieldRegistration'
import { getDefaults } from '../constants/defaults'

export const onBlur = (config: {
  formName?: string
  fieldName: string
}) => () => {
  const {
    formName,
    fieldName,
  } = { formName: getDefaults().formName, ...config }

  const fieldRegistration = FormFieldRegistry[formName][fieldName]
  if (fieldRegistration.validateOptions.on !== ValidateOnOptions.BLUR) {
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
    validate,
    fieldName,
  } = fieldRegistration
  if (typeof validate === 'function') {
    const error = validate(value)
    onChangeError({ formName, fieldName })(error)
  }
}
