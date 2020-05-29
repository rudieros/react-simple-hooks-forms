import { useContext, useMemo, useState } from 'react'
import { DEFAULT_FORM_NAME } from '../constants/defaultFormName'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import { onChangeError } from '../helpers/onChangeError'

export const useFormFieldError = (fieldName: string, {
  formName: optionalFormName,
  setterOnly,
}: {
  formName?: string,
  setterOnly?: boolean
} = {
  setterOnly: false,
}) => {
  const { formName: formNameFromContext } = useContext(FormContext)
  const formName = optionalFormName || formNameFromContext || DEFAULT_FORM_NAME

  if (!Form[formName] && !optionalFormName) {
    throw new Error('NoFormFound')
      .message = 'No form was found in the context and you have not provided one. Did you forget to call `useForm()`?'
  } else if (!Form[formName]) {
    throw new Error('NoFormFound')
      .message = `No form was found for name ${formName}. You need to pass this name to 'useForm()'`
  }

  const [fieldError, setFieldError] = useState(Form[formName].values[fieldName])

  const subId = useMemo(() => {
    if (setterOnly) {
      return
    }
    const id = Date.now().toString()
    FormFieldSubscriptions[formName][fieldName] = {
      ...(FormFieldSubscriptions[formName][fieldName] || {}),
      errorListenerSubscribers: {
        ...((FormFieldSubscriptions[formName][fieldName] || {} as any).errorListenerSubscribers || {}),
        [id]: (value) => {
          setFieldError(value)
        }
      },
    }
    return id
  }, [])

  // TODO unsubscribe
  return {
    set: onChangeError({ formName, fieldName }),
    error: fieldError,
  }
}
