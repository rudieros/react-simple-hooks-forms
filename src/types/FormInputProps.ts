export interface FormInputProps {
  name: string
  mask?: (value: any) => any
  unmask?: (value: any) => any
  validate?: (value: any) => any
  validateOptions?: ValidationOptions
  formName?: string
  initialValue?: any
  saveUnmaskedValue?: boolean
}

export interface ValidationOptions {
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
