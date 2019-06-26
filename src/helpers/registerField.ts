import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { ValidationTrigger, ValidationOrder, ValidationOptions } from '../types/FormInputProps'
import { onChangeError } from './onChangeError'
import { onChangeValue } from './onChangeValue'
import { FieldRegistration } from '../types/FieldRegistration'
import { onBlur as buildOnBlur } from './onBlur'

export const registerField = (formName: string) => (input: FieldRegistration) => {
  if (!Form[formName]) {
    throw new Error('FormNotFound').message = `No form was found for the given name '${formName}'. Did you forget to call 'useForm()'?`
  }
  const {
    fieldName,
    validationOptions,
  } = input

  FormFieldRegistry[formName][fieldName] = {
    ...input,
    validationOptions: { ...defaultValidateOptions, ...validationOptions },
  }
  const onChange = onChangeValue({ fieldName, formName })
  const onError = onChangeError({ fieldName, formName })
  const onBlur = buildOnBlur({ fieldName, formName })

  // TODO unregister

  return { onChange, onError, onBlur }
}

const defaultValidateOptions: ValidationOptions = {
  trigger: ValidationTrigger.ON_CHANGE,
  order: ValidationOrder.AFTER_MASK
}
