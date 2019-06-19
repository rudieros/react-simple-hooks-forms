export const FormFieldSubscriptions: {
  [formName: string]: {
    [fieldName: string]: {
      changeListenerSubscribers: { [subscriptionId: string]: (value: any) => void }
      errorListenerSubscribers: { [subscriptionId: string]: (value: any) => void }
    }
  }
} = {}
