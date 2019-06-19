import * as React from 'react'
import './App.css'
import { TextInput } from './inputs/TextInput'
import { useFormFieldValue, useForm } from 'react-hooks-forms'

const formName = 'MyForm'

const App = () => {
  const { Form, submit } = useForm({
    initialValues: { name: 'Rudi' },
    formName: 'MyForm',
    validator: () => ({})
  })
  const { value: lastName } = useFormFieldValue('name')
  const { set: setEmail } = useFormFieldValue('email', { setterOnly: true, formName })

  const setEmailToBeLastName = () => setEmail(lastName)
  const validateName = (name) => name.length < 3 ? 'Nome é muito curto' : undefined
  const onClickSubmit = () => {
    submit((values) => {
      console.log('Values on success', values)
    }, (errors) => {
      console.log('Errors', errors)
    })
  }
  return (
    <Form>
      <div>Olá</div>
      <TextInput name={'name'} validate={validateName}/>
      <TextInput name={'email'}/>
      <button onClick={setEmailToBeLastName}>Set email from lastName</button>
      <button onClick={onClickSubmit}>Submit form</button>
    </Form>
  )
}

export default App
