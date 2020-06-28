import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { ValidationTrigger, ValidationOrder, ValidationOptions } from '../types/FormInputProps'
import { buildOnChangeError } from './buildOnChangeError'
import { buildOnChangeValue } from './buildOnChangeValue'
import { FieldRegistration } from '../types/FieldRegistration'
import { onBlur as buildOnBlur } from './onBlur'
import { setFormFieldRegistration } from './formFieldRegistrationHelpers'

export const registerField = (formName: string) => (input: FieldRegistration) => {
  if (!Form[formName]) {
    throw new Error('FormNotFound').message = `No form was found for the given name '${formName}'. Did you forget to call 'useForm()'?`
  }
  const {
    fieldName,
    validationOptions,
  } = input

  setFormFieldRegistration(formName, fieldName, {
    ...input,
    validationOptions: { ...defaultValidateOptions, ...validationOptions },
  })

  const onChange = buildOnChangeValue({ fieldName, formName })
  const onError = buildOnChangeError({ fieldName, formName })
  const onBlur = buildOnBlur({ fieldName, formName })

  // TODO unregister

  return { onChange, onError, onBlur }
}

const defaultValidateOptions: ValidationOptions = {
  trigger: ValidationTrigger.ON_CHANGE,
  order: ValidationOrder.AFTER_MASK
}
