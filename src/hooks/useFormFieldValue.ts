import { useContext, useMemo, useState } from 'react'
import { DEFAULT_FORM_NAME } from '../constants/defaultFormName'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import objectPath from 'object-path'
import { getRandomId } from '../helpers/getRandomId'
import { onChangeValue } from '../helpers/onChangeValue'

export const useFormFieldValue = (fieldName: string, {
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
  const [fieldValue, setFieldValue] = useState(objectPath.get(Form[formName].values, fieldName))

  const subId = useMemo(() => {
    if (setterOnly) {
      return
    }
    const id = getRandomId()
    FormFieldSubscriptions[formName][fieldName] = {
      changeListenerSubscribers: {
        ...((FormFieldSubscriptions[formName][fieldName] || {}).changeListenerSubscribers || {}),
        [id]: (value) => {
          setFieldValue(value)
        }
      },
      ...(FormFieldSubscriptions[formName][fieldName] || {})
    }
    return id
  }, [])

  // TODO unsubscribe on unmount
  return {
    set: onChangeValue({ formName, fieldName }),
    value: fieldValue,
  }
}
