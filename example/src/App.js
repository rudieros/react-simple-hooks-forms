import React, { Component } from 'react'
import { useForm, ValidateOnOptions } from 'react-simple-hooks-forms'
import { TextFormField } from './TextFormField'
import { parsePhone, unparsePhone, validatePhone } from './parsers/parsePhone'

const validator = (values) => {
  const errors = {}
  if (!values.name) {
    errors.name = 'Name is required'
  }
  return errors
}

const initialValues = { name: 'John', phone: '11981216988' }

export default () => {
  const { Form, submit } = useForm({ validator, initialValues })
  const onSubmit = () => {
    submit((values) => {
        console.log('Success', values)
      },
      (error) => {
        console.log('Error', error)
      })
  }
  return <Form>
    <TextFormField
      name={'name'}
    />
    <br/>
    <TextFormField
      name={'phone'}
      mask={parsePhone}
      unmask={unparsePhone}
      validate={validatePhone}
      saveUnmaskedValue
      validateOptions={{
        on: ValidateOnOptions.BLUR,
      }}
    />
    <br/>
    <TextFormField
      name={'phone2'}
      mask={parsePhone}
      unmask={unparsePhone}
      validate={validatePhone}
      saveUnmaskedValue
      validateOptions={{
        on: ValidateOnOptions.ON_CHANGE,
      }}
    />
    <br/>
    <button onClick={onSubmit}>Submit</button>
  </Form>
}
