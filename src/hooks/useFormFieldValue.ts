import { useContext, useMemo, useState } from 'react'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import objectPath from 'object-path'
import { getRandomId } from '../helpers/getRandomId'
import { onChangeValue } from '../helpers/onChangeValue'
import { getDefaultFormName } from '../constants/defaults'

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
  const formName = optionalFormName || formNameFromContext || getDefaultFormName()
  if (!Form[formName] && !optionalFormName) {
    throw new Error('NoFormFound')
      .message = 'No form was found in the context and you have not provided one. Did you forget to call `useForm()`?'
  } else if (!Form[formName]) {
    throw new Error('NoFormFound')
      .message = `No form was found for name ${formName}. You need to pass this name to 'useForm()' config`
  }
  const [fieldValue, setFieldValue] = useState(objectPath.get(Form[formName].values, fieldName))

  const subId = useMemo(() => {
    if (setterOnly) {
      return
    }
    const id = getRandomId()
    FormFieldSubscriptions[formName][fieldName] = {
      ...(FormFieldSubscriptions[formName][fieldName] || {}),
      changeListenerSubscribers: {
        ...((FormFieldSubscriptions[formName][fieldName] || {}).changeListenerSubscribers || {}),
        [id]: (value) => {
          setFieldValue(value)
        }
      },
    }
    return id
  }, [])

  // TODO unsubscribe trigger unmount
  return {
    set: onChangeValue({ formName, fieldName }),
    value: fieldValue,
  }
}
