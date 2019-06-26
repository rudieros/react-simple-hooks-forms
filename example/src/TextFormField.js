import React from 'react'
import { useFormInput } from 'react-simple-hooks-forms'

export const TextFormField = (props) => {
  const { value, setValue, error, setBlur } = useFormInput(props)
  const onChange = (e) => setValue(e.target.value)

  return <input
    style={{
      borderColor: error ? 'red' : undefined,
    }}
    name={props.name}
    value={value}
    onChange={onChange}
    onBlur={setBlur}
  />
}
