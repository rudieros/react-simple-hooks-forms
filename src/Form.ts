import { FormType } from './types/FormType'

export const Form: {
  [formName: string]: FormType
} = {}

{
  (window as any).Form = Form
}
