import { useContext, useMemo, useState } from 'react'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { registerField as defaultRegisterField } from '../helpers/registerField'
import { FormInputProps } from '../types/FormInputProps'

export const useFormInput = (props: FormInputProps) => {
  const {
    formName: formNameFromContext,
    registerField: registerFieldFromContext,
  } = useContext(FormContext)

  const formName = props.formName || formNameFromContext
  if (!formName) {
    throw new Error('NoFormFound')
      .message = 'No form was found in the context and you have not provided one. Did you forget to call `useForm()`?'
  }
  const registerField = registerFieldFromContext || defaultRegisterField(formName)

  const fieldName = props.name
  const initialValue = Form[formName].initialValues[fieldName] || props.initialValue || ''
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<undefined | string>(undefined)
  const { onChange, onError } = useMemo(() => {
    return registerField({
      changeListener: setValue,
      errorListener: setError,
      fieldName,
      mask: props.mask,
      validate: props.validate,
      validateOptions: props.validateOptions,
    })
  }, [fieldName, formName])

  return { value, error, setValue: onChange, setError: onError }
}
