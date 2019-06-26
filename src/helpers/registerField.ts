import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { ValidateOnOptions, ValidateOrderOptions } from '../types/FormInputProps'
import { onChangeError } from './onChangeError'
import { onChangeValue } from './onChangeValue'
import { FieldRegistration } from '../types/FieldRegistration'

export const registerField = (formName: string) => (input: FieldRegistration) => {
  if (!Form[formName]) {
    throw new Error('FormNotFound').message = `No form was found for the given name '${formName}'. Did you forget to call 'useForm()'?`
  }
  const {
    fieldName,
    validateOptions,
  } = input

  FormFieldRegistry[formName][fieldName] = {
    ...input,
    validateOptions: { ...defaultValidateOptions, ...validateOptions },
  }
  const onChange = onChangeValue({ fieldName, formName })
  const onError = onChangeError({ fieldName, formName })

  // TODO unregister

  return { onChange, onError }
}

const defaultValidateOptions = {
  on: ValidateOnOptions.REAL_TIME,
  order: ValidateOrderOptions.AFTER_MASK
}
