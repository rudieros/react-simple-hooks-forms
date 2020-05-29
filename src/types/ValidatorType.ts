export type ValidatorType<FormType = any> = (values: FormType) => { [fieldKey: string]: string }
