import { ValidateOnOptions, ValidateOrderOptions } from './types/FormInputProps'

export const FormFieldRegistry: {
  [formName: string]: {
    [fieldValue: string]: {
      changeListener: (value: any) => void
      errorListener: (value: any) => void
      mask?: (input: any) => any
      validate?: (value: any) => string | undefined
      validateOptions?: {
        on: ValidateOnOptions,
        order: ValidateOrderOptions,
      }
    }
  }
} = {}
