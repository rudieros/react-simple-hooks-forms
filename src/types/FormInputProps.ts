export interface FormInputProps {
  name: string
  mask?: (value: any) => any
  validate?: (value: any) => any
  validateOptions?: ValidateOptions,
  formName?: string
  initialValue?: any
}

export interface ValidateOptions {
  on: ValidateOnOptions,
  order: ValidateOrderOptions
}

export enum ValidateOnOptions {
  REAL_TIME,
  BLUR
}

export enum ValidateOrderOptions {
  BEFORE_MASK,
  AFTER_MASK,
}