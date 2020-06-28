import { ValidationOptions } from './FormInputProps'

export interface FormType {
  values: { [field: string]: any }
  errors: { [field: string]: string | undefined }
  fields: { [field: string]: boolean }
  initialValues: { [field: string]: any }
  dirty?: boolean
  validationOptions: ValidationOptions
  enableEventBubbling?: boolean
}
