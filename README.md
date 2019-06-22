# React Simple Hooks Forms

Performatic forms for React/React Native using hooks api.
Yes we're running out of names for React Forms with hooks.

## Installation
```
yarn add react-simple-hooks-forms
```
or 
```
npm i react-simple-hooks-forms
```

## Basic Usage
Build your inputs: (works with React and React Native)

```jsx
import React from 'react'
import { useFormInput } from 'react-hooks-forms'

export const TextFormField = (props) => {
    const { value, setValue } = useFormInput(props)
    const onChange = (e) => setValue(e.target.value)
    
    return <input
      name={props.name}
      value={value}
      onChange={onChange}
    />
}
```
Wrap your fields with the `Form` component:
```jsx
import React from 'react'
import { useForm } from 'react-hooks-forms'

const validator = (values) => {
  const errors = {}
  if (!values.name) {
    errors.name = 'Name is required'
  }
  return errors
}

const initialValues = { name: 'John' }

const App = () => {
  const { Form, submit } = useForm({ initialValues, validator })
  return <Form>
    <TextFormField name={'name'} />
    <TextFormField name={'email'} />
    <button onClick={submit}>
      Submit
     </button>
  </Form>
}
```
