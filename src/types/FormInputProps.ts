export interface FormInputProps {
  name: string
  mask?: (value: any) => any
  unmask?: (value: any) => any
  validator?: (value: any) => any
  validationOptions?: ValidationOptions
  formName?: string
  initialValue?: any
  saveUnmaskedValue?: boolean
}

export interface ValidationOptions {
  trigger: ValidationTrigger,
  order: ValidationOrder
}

export enum ValidationTrigger {
  ON_CHANGE,
  BLUR
}

export enum ValidationOrder {
  BEFORE_MASK,
  AFTER_MASK,
}
