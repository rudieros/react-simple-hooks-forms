import * as React from 'react'
import { registerField } from './helpers/registerField'

export const FormContext = React.createContext({
  formName: undefined,
  registerField: undefined
} as {
  formName?: string
  registerField?: ReturnType<typeof registerField>
})
