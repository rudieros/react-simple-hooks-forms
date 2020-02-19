import { Form } from '../Form'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'

export const cleanForm = (formName: string, cleanOnUnmount: boolean) => () => () => {
  if (!cleanOnUnmount) {
    return
  }
  delete Form[formName]
  delete FormFieldSubscriptions[formName]
  delete FormFieldRegistry[formName]
}
