import { ValidationOptions } from './FormInputProps'

export interface FormInstanceType<FormType extends Object = any> {
  values: FormType
  errors: { [field: string]: string | undefined }
  fields: { [field: string]: boolean }
  initialValues: Partial<FormType>
  dirty?: boolean
  validationOptions: ValidationOptions
}
