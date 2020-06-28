import { ValidationOptions } from './FormInputProps'

export interface FieldRegistration {
  fieldName: string
  changeListener: (value: any) => void
  errorListener: (error: any) => void
  mask?: (value: any) => any
  unmask?: (value: any) => any
  validator?: (value: any) => string | undefined
  validationOptions: ValidationOptions
  saveUnmaskedValue?: boolean
  enableEventBubbling?: boolean
}
