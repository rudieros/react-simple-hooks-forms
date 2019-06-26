import React from 'react'
import { useFormInput } from 'react-simple-hooks-forms'

export const TextFormField = (props) => {
  const { value, setValue } = useFormInput(props)
  const onChange = (e) => setValue(e.target.value)

  return <input
    name={props.name}
    value={value}
    onChange={onChange}
  />
}
