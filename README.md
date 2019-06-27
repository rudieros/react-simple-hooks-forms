# React Simple Hooks Forms

Performatic forms for React/React Native using hooks api.
Yes we're running out of names for React Forms with hooks.

Typescript typings available.

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
```
Wrap your fields with the `Form` component:
```jsx
import React from 'react'
import { useForm } from 'react-simple-hooks-forms'
import { TextFormField } from './TextFormField'

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

## Listening to Field Values
In many cases you may need to do something based on the value of a field, like changing the value of another field for 
instance. For this you may use the hook `useFormFieldValue`, and it works in any component that is wrapped with the Form
context.
```jsx
import { useForm, useFormFieldValue } from 'react-simple-hooks-forms'

const getPasswordStrength = (password) => {
  if (password.length >= 20) {
    return 'very strong'
  } else if (password.length >= 10) {
    return 'strong'
  } else if (password.length >= 6) {
    return 'adequate'
  }
  return 'week'
}

const PasswordStrength = () => {
  const { value: passwordValue } = useFormFieldValue('password')
  
  return <div>{`This password is ${getPasswordStrength(passwordValue)}`}</div>
}

export default () => {
  const { Form } = useForm()
  
  return <Form>
    <TextFormField name={'password'} />
    <PasswordStrength />
  </Form>
}
```

Although not recommended in most cases because of performance issues, you may use it outside the Form context by 
providing a name to both your `useForm` and your `useFormFieldValue` hooks:

```jsx
const formName = 'LoginForm'

export default () => {
  const { Form } = useForm({ formName })
  const { value: passwordValue } = useFormFieldValue('password', { formName })
  return <Form>
    <TextFormField name={'password'} />
    <div>{`This password is ${getPasswordStrength(passwordValue)}`}</div>
  </Form>
}
```

You may use this hook to set the values of fields as well. In the next example we fill a username field based on the name
field. You can pass a configuration like `{ setterOnly: true }` if you do not wish to listen to the value and simply have
a setter for it.

```jsx
const formName = 'SignUpForm'

export default () => {
  const { Form } = useForm({ formName })
  const { value: fullNameValue } = useFormFieldValue('fullName', { formName })
  const { set: setUsername } = useFormFieldValue('username', { formName, setterOnly: true })
  
  useEffect(() => {
     setUsername(nameValue.trim().toLowerCase())
  }, [nameValue])
  
  return <Form>
    <TextFormField name={'fullName'} />
    <TextFormField name={'username'} />
  </Form>
}
```

## Validation

This lib provides form and field-level validation. To use form-level validation simply pass a `validator` function to 
the `useForm` hook. This function receives a FormValues object and should return an object containing
the error messages. You might want to use a third party library to handle this, like [ValidateJs](https://validatejs.org/).

```jsx
const validator = (values) => {
  const errors = {}
  if (!values.name) {
    errors.name = 'Name is required'
  } else if (values.name.length < 2) {
    errors.name = 'Name is too short'
  }
  return errors
}

export default () => {
  const { Form, submit } = useForm({ validator })
  return <Form>
    <TextFormField name={'name'} />
    <button onClick={submit}>
      Submit
     </button>
  </Form>
}
```

You can use field-level validation by passing a `validator` prop to your wrapped input component. This will by default
validate the field on every input change.

```jsx
const passwordValidator = (password) => {
  if (password.length < 6) {
    return 'Password is too short'
  }
}

export default () => {
  const { Form } = useForm()
  return <Form>
    <TextFormField 
      name={'password'} 
      validator={passwordValidator} 
     />
  </Form>
}
```

You can choose to validate on the field's onBlur:
```jsx
const TextFormField = (props) => {
    const { value, setValue } = useFormInput(props)
    const onChange = (e) => setValue(e.target.value)
    return <input
      name={props.name}
      value={value}
      onChange={onChange}
    />
}

export default () => {
  const { Form } = useForm()
  return <Form>
    <TextFormField 
      name={'password'} 
      validate={passwordValidator}
      validationOptions={{
        trigger: ValidationOptions.BLUR,
      }}
     />
  </Form>
}
```


## TBD
Async Validation

Documentation on Api Reference
