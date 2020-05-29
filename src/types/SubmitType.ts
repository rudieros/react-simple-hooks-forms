export type SubmitType<FormType extends Object = any> =
  (onSuccess?: (values: FormType) => void, onError?: (errors: any) => void) => PromiseLike<FormType>
