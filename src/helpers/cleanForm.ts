import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'

export const cleanForm = (formName: string) => () => () => {
  // todo clean form fields subscriptions
  if (process.env.NODE_ENV === 'development') {
    return
  }
  delete Form[formName]
  delete FormFieldSubscriptions[formName]
  delete FormFieldRegistry[formName]
}
