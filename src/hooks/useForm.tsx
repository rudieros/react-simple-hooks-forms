import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { Form } from '../Form'
import { FormContext } from '../FormContext'
import { FormFieldRegistry } from '../FormFieldRegistry'
import { FormFieldSubscriptions } from '../FormFieldSubscriptions'
import { cleanForm } from '../helpers/cleanForm'
import { registerField } from '../helpers/registerField'
import { ValidationOptions } from '../types/FormInputProps'
import { getDefaults } from '../constants/defaults'
import { eventBubblingEnabled } from '../eventBubbling'
import { getFormFieldRegistration } from '../helpers/formFieldRegistrationHelpers'
import objectPath from 'object-path'

export const useForm = ({
  initialValues,
  formName: givenFormName,
  validator,
  validationOptions,
  cleanOnUnmount: givenCleanOnUnmount,
  enableEventBubbling,
}: {
  initialValues?: any,
  formName?: string,
  validator?: (values: { [fieldName: string]: any }) => { [fieldName: string]: string },
  validationOptions?: ValidationOptions,
  cleanOnUnmount?: boolean,
  enableEventBubbling?: boolean
} = {}) => {
  const defaults = getDefaults()
  const formName = givenFormName || defaults.formName
  const cleanOnUnmount = givenCleanOnUnmount !== undefined ? givenCleanOnUnmount : defaults.cleanOnUnmount

  const FormComponent = useMemo(() => {
    initializeForm({ formName, initialValues, validationOptions, enableEventBubbling })
    return (props: any) =>
      <FormContext.Provider
        value={{ registerField: registerField(formName), formName }}
        {...props}
      /> as any
  }, [])

  const submit = useCallback(buildSubmit(formName, validator), [formName, validator])
  const reset = useCallback(buildReset(formName, validator), [formName, validator])

  useEffect(cleanForm(formName, cleanOnUnmount), [])
  return { Form: FormComponent, submit, reset }
}

const initializeForm = ({
                          initialValues,
                          formName,
                          validationOptions,
                          enableEventBubbling,
                        }: {
  initialValues?: any,
  formName: string,
  validator?: (values: { [fieldName: string]: any }) => { [fieldName: string]: string },
  validationOptions?: ValidationOptions,
  enableEventBubbling?: boolean
}) => {
  const defaults = getDefaults()
  Form[formName] = {
    fields: {},
    initialValues: { ...(initialValues || {}) },
    values: { ...(initialValues || {}) },
    errors: {},
    dirty: false,
    validationOptions: { ...defaults.validationOptions, ...(validationOptions || {}) },
    enableEventBubbling: enableEventBubbling ?? eventBubblingEnabled,
  }
  FormFieldRegistry[formName] = {}
  FormFieldSubscriptions[formName] = {}
}

const buildSubmit = (formName: string, validator?: (values: any) => {[fieldName: string]: string | undefined}) => {
  return async (onSuccess: (values: any) => any, onError: (errors: any) => any) => {
    const values = Form[formName].values
    let errors = Form[formName].errors || {}
    if (typeof validator === 'function') {
      let validatorResult = await validator(values)
      errors = { ...errors, ...validatorResult }
    }
    const hasErrors = evaluateErrors(errors, formName)
    if (hasErrors) {
      return onError(errors)
    }
    onSuccess(values)
  }
}

const buildReset = (formName: string, validator?: (values: any) => {[fieldName: string]: string | undefined}) => () => {
  const fieldNames = Object.keys(FormFieldRegistry[formName] || {})
  const initialValues = Form[formName].initialValues

  Form[formName].values = {...initialValues}

  fieldNames.forEach((fieldName: string) => {
    const changeListeners = Object.values((FormFieldSubscriptions[formName][fieldName] || {} as any).changeListenerSubscribers || {})
    changeListeners.forEach((listener) => listener(initialValues[fieldName]))
    FormFieldRegistry[formName][fieldName].changeListener(initialValues[fieldName])
  })
  if (typeof validator === 'function') {
    const errors = validator(initialValues)
    evaluateErrors(errors, formName)
  }
}

const evaluateErrors = (errors: { [fieldName: string]: string | undefined }, formName: string) => {
  let hasErrors = false
  notifyErrors(errors, formName, () => {
    hasErrors = true
  })
  return hasErrors
}

const notifyErrors = (errors: { [fieldName: string]: string | undefined }, formName: string, setHasErrors: () => void) => {
  Object.keys(errors).forEach((errKey) => {
    const error = errors[errKey]
    if (!!error) {
      setHasErrors()
    }
    getFormFieldRegistration(formName, errKey)?.errorListener(error)
    const errorListeners =  Object.values(objectPath.get(FormFieldSubscriptions, `${formName}.${errKey}`)?.errorListenerSubscribers || {})
    errorListeners.forEach((listener) => {
      (listener as any)?.(error)
    })
    if (typeof errors[errKey] === 'object') {
      notifyErrors(errors[errKey] as any, `${formName}.${errKey}`, setHasErrors)
    }
  })
}
