import React, { Component } from 'react'
import { useForm } from 'react-simple-hooks-forms'
import {TextFormField} from "./TextFormField"

const validator = (values) => {
  const errors = {}
  if (!values.name) {
    errors.name = 'Name is required'
  }
  return errors
}

const initialValues = { name: 'John' }

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
    <TextFormField name={'name'}/>
    <button onClick={onSubmit}>Submit</button>
  </Form>
}
