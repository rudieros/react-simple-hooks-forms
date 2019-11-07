import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'

export const cleanForm = (formName: string) => () => () => {
  // todo clean form fields subscriptions
  delete Form[formName]
  delete FormFieldSubscriptions[formName]
  delete FormFieldRegistry[formName]
}
