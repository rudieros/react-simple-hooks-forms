import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { DEFAULT_FORM_NAME } from '../constants/defaultFormName'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import { cleanForm } from '../helpers/cleanForm'
import { registerField } from '../helpers/registerField'

export const useForm = ({
  initialValues,
  formName: givenFormName,
  validator,
}: {
  initialValues: any,
  formName?: string,
  validator?: (values: { [fieldName: string]: any }) => { [fieldName: string]: string }
}) => {
  const formName = givenFormName || DEFAULT_FORM_NAME
  const FormComponent = useMemo(() => {
    Form[formName] = {
      fields: {},
      initialValues: { ...(initialValues || {}) },
      values: { ...(initialValues || {}) },
      errors: {},
      dirty: false
    }
    FormFieldRegistry[formName] = {}
    FormFieldSubscriptions[formName] = {}
    return (props: any) =>
      <FormContext.Provider
        value={{ registerField: registerField(formName), formName }}
        {...props}
      /> as any
  }, [])

  const submit = useCallback(buildSubmit(formName, validator), [])

  useEffect(cleanForm(formName), [])
  return { Form: FormComponent, submit }
}

const buildSubmit = (formName: string, validator?: (values: any) => {[fieldName: string]: string | undefined}) => {
  return (onSuccess: (values: any) => any, onError: (errors: any) => any) => {
    const values = Form[formName].values
    let errors = Form[formName].errors || {}
    if (typeof validator === 'function') {
      errors = { ...errors, ...validator(values) }
    }
    const hasErrors = evaluateErrors(errors, formName)
    if (hasErrors) {
      return onError(errors)
    }
    onSuccess(values)
  }
}

const evaluateErrors = (errors: { [fieldName: string]: string | undefined }, formName: string) => {
  let hasErrors = false
  const fieldNames = Object.keys(FormFieldRegistry[formName] || {})
  fieldNames.forEach((fieldName) => {
    const error = errors[fieldName]
    if (error) {
      hasErrors = true
    }
    const errorListeners = Object.values((FormFieldSubscriptions[formName][fieldName] || {}).errorListenerSubscribers || {})
    errorListeners.forEach((listener) => listener(error))
    FormFieldRegistry[formName][fieldName].errorListener(error)
  })
  return hasErrors
}
