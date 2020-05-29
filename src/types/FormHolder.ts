import * as React from 'react'
import { SubmitType } from './SubmitType'

export type FormHolder<FormType extends Object = any> = {
  Form: React.ComponentType<{ children: any }>,
  submit: SubmitType<FormType>
  reset: () => void
}
