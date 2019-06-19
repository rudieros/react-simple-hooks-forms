import * as React from 'react'
import { FormInputProps, useFormInput } from 'react-hooks-forms'

export const TextInput: React.FunctionComponent<FormInputProps> = React.memo(({
                                                                                ...formInputProps
                                                                              }) => {
  const { value, setValue, error, setError } = useFormInput(formInputProps)
  const onChange = (e: any) => setValue(e.target.value)
  return <input
    name={formInputProps.name}
    value={value}
    onChange={onChange}
    style={error ? {
      borderColor: 'red',
    } : {}}
  />
})
