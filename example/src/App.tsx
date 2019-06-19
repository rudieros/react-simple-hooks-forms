import React from 'react'
import './App.css'
import { useForm, useFormFieldValue } from 'react-hooks-forms'
import { TextInput } from './inputs/TextInput'

const formName = 'MyForm'

const App = () => {
  const { Form, submit, reset } = useForm({
    initialValues: { name: 'Rudi' },
    formName: 'MyForm',
    validator: () => ({})
  })
  const { value: lastName } = useFormFieldValue('name', { formName })
  const { set: setEmail } = useFormFieldValue('email', { setterOnly: true, formName })

  const setEmailToBeLastName = () => setEmail(lastName)
  const validateName = (name: any) => name.length < 3 ? 'Nome é muito curto' : undefined
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextInput name={'name'} validate={validateName}/>
        <TextInput name={'email'}/>
        <TextInput name={'email2'}/>
        <TextInput name={'email22'}/>
        <TextInput name={'email22'}/>
        <TextInput name={'email1'}/>
        <TextInput name={'email3'}/>
        <TextInput name={'email123'}/>
        <TextInput name={'email321'}/>
        <TextInput name={'email32'}/>
        <TextInput name={'email41'}/>
        <TextInput name={'emaildas'}/>
        <TextInput name={'emaild'}/>
        <TextInput name={'emaileda'}/>
        <TextInput name={'emailgd'}/>
        <TextInput name={'emailgsdf'}/>
        <TextInput name={'emaigfdl'}/>
        <TextInput name={'emailgafs'}/>
        <TextInput name={'emailgf'}/>
        <TextInput name={'emailfa'}/>
        <TextInput name={'emailfsad'}/>
        <TextInput name={'emailfasd'}/>
        <TextInput name={'emailhgf'}/>
        <TextInput name={'emailbvc'}/>
        <TextInput name={'emaildg'}/>
        <TextInput name={'emailqwe'}/>
        <TextInput name={'emailhgsdf'}/>
        <TextInput name={'emailwer'}/>
        <TextInput name={'emaihfl'}/>
        <TextInput name={'emailgas'}/>
        <button onClick={setEmailToBeLastName}>Set email from lastName</button>
        <button onClick={onClickSubmit}>Submit form</button>
        <button onClick={reset}>Reset form</button>
      </div>
    </Form>
  )
}

export default App