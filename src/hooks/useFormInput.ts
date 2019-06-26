import { useContext, useMemo, useState } from 'react'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { registerField as defaultRegisterField } from '../helpers/registerField'
import { FormInputProps } from '../types/FormInputProps'

export const useFormInput = (formInputProps: FormInputProps) => {
  const props = {
    saveUnmaskedValue: true,
    ...formInputProps,
  }
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
  const initialValue = applyMask(Form[formName].initialValues[fieldName] || props.initialValue || '', props)
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<undefined | string>(undefined)
  const { onChange, onError } = useMemo(() => {
    return registerField({
      changeListener: setValue,
      errorListener: setError,
      fieldName,
      mask: props.mask,
      unmask: props.unmask,
      validate: props.validate,
      validateOptions: props.validateOptions,
      saveUnmaskedValue: props.saveUnmaskedValue,
    })
  }, [fieldName, formName])

  return {
    value: applyMask(value, props),
    error,
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
