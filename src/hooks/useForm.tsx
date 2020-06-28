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

export const useForm = ({
  initialValues,
  formName: givenFormName,
  validator,
  validationOptions,
  cleanOnUnmount: givenCleanOnUnmount,
}: {
  initialValues?: any,
  formName?: string,
  validator?: (values: { [fieldName: string]: any }) => { [fieldName: string]: string },
  validationOptions?: ValidationOptions,
  cleanOnUnmount?: boolean
} = {}) => {
  const defaults = getDefaults()
  const formName = givenFormName || defaults.formName
  const cleanOnUnmount = givenCleanOnUnmount !== undefined ? givenCleanOnUnmount : defaults.cleanOnUnmount

  const FormComponent = useMemo(() => {
    initializeForm({ formName, initialValues, validationOptions })
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
                        }: {
  initialValues?: any,
  formName: string,
  validator?: (values: { [fieldName: string]: any }) => { [fieldName: string]: string },
  validationOptions?: ValidationOptions
}) => {
  const defaults = getDefaults()
  Form[formName] = {
    fields: {},
    initialValues: { ...(initialValues || {}) },
    values: { ...(initialValues || {}) },
    errors: {},
    dirty: false,
    validationOptions: { ...defaults.validationOptions, ...(validationOptions || {}) },
  }
  FormFieldRegistry[formName] = {}
  FormFieldSubscriptions[formName] = {}
}

const buildSubmit = (formName: string, validator?: (values: any) => {[fieldName: string]: string | undefined}) => {
  return async (onSuccess: (values: any) => any, onError: (errors: any) => any) => {
    const values = Form[formName].values
    let errors = Form[formName].errors || {}
    if (typeof validator === 'function') {
      let validatorResult = validator(values)
      if (validatorResult instanceof Promise) {
        validatorResult = await validatorResult
      }
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
