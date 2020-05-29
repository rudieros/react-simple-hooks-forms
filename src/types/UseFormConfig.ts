import { ValidationOptions } from './FormInputProps'
import { ValidatorType } from './ValidatorType'

export type UseFormConfig<FormType = any> = {
  initialValues?: Partial<FormType>,
  formName?: string,
  validator?: ValidatorType<FormType>,
  validationOptions?: ValidationOptions,
  cleanOnUnmount?: boolean
}
