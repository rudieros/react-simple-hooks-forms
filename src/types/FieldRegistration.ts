import { ValidationOptions } from './FormInputProps'

export interface FieldRegistration {
  fieldName: string
  changeListener: (value: any) => void
  errorListener: (error: any) => void
  mask?: (value: any) => any
  unmask?: (value: any) => any
  validate?: (value: any) => string | undefined
  validateOptions: ValidationOptions
  saveUnmaskedValue?: boolean
}
