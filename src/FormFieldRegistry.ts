import { FieldRegistration } from './types/FieldRegistration'

export const FormFieldRegistry: {
  [formName: string]: {
    [fieldValue: string]: FieldRegistration
  }
} = {}
