import { useContext, useMemo, useState } from 'react'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { registerField as defaultRegisterField } from '../helpers/registerField'
import { FormInputProps } from '../types/FormInputProps'
import { getDefaults } from '../constants/defaults'

export const useFormInput = (formInputProps: FormInputProps) => {
  const props = {
    saveUnmaskedValue: false,
    ...formInputProps,
  }
  const {
    formName: formNameFromContext,
    registerField: registerFieldFromContext,
  } = useContext(FormContext)

  const {
    name,
    formName: givenFormName,
    initialValue: givenInitialValue,
    ...fieldRegistration
  } = props

  const formName = givenFormName || formNameFromContext
  if (!formName) {
    throw new Error('NoFormFound')
      .message = 'No form was found in the context and you have not provided one. Did you forget to call `useForm()`?'
  }
  const registerField = registerFieldFromContext || defaultRegisterField(formName)

  const fieldName = name
  const initialValue = applyMask(givenInitialValue || Form[formName].initialValues[fieldName] || '', props)
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<undefined | string>(undefined)
  const { onChange, onError, onBlur } = useMemo(() => {
    const defaults = getDefaults()
    return registerField({
      changeListener: setValue,
      errorListener: setError,
      fieldName,
      ...fieldRegistration,
      validateOptions: { ...defaults.validationOptions, ...props.validateOptions },
    })
  }, [fieldName, formName])

  return {
    value: applyMask(value, props),
    error,
    setBlur: onBlur,
    setValue: onChange,
    setError: onError,
  }
}

const applyMask = (value: any, props: FormInputProps) => {
  const { mask, saveUnmaskedValue } = props
  if (saveUnmaskedValue && typeof mask === 'function') {
    return mask(value)
  }
  return value
}
