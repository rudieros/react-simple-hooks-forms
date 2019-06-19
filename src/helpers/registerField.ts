import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { ValidateOnOptions, ValidateOptions, ValidateOrderOptions } from '../types/FormInputProps'
import { onChangeError } from './onChangeError'
import { onChangeValue } from './onChangeValue'

export const registerField = (formName: string) => (input: {
  fieldName: string
  changeListener: (value: any) => void
  errorListener: (error: any) => void
  mask?: (value: any) => any
  validate?: (value: any) => string | undefined
  validateOptions?: ValidateOptions
}) => {
  if (!Form[formName]) {
    throw new Error('FormNotFound').message = `No form was found for the given name '${formName}'. Did you forget to call 'useForm()'?`
  }
  const {
    fieldName,
    changeListener,
    errorListener,
    mask,
    validate,
    validateOptions,
  } = input

  FormFieldRegistry[formName][fieldName] = {
    changeListener,
    errorListener,
    mask,
    validateOptions: { ...defaultValidateOptions, ...validateOptions },
    validate,
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
