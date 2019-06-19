export const Form: {
  [formName: string]: {
    values: { [field: string]: any }
    errors: { [field: string]: string | undefined }
    fields: { [field: string]: boolean }
    initialValues: { [field: string]: any }
    dirty: boolean
  }
} = {}

{
  (window as any).Form = Form
}
