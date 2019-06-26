export const parsePhone = (inputValue) => {
  if (!inputValue) {
    return ''
  }
  let v = inputValue.replace(/\D/g, '')
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2').substr(0, 14)
  v = v.replace(/(\d)(\d{4})$/, '$1-$2')
  return v
}

export const unparsePhone = (inputValue) => {
  if (!inputValue) {
    return ''
  }
  return inputValue.replace(/[^\d]/g, '')
}

export const validatePhone = (inputValue) => {
  const nums = inputValue.replace(/\D/g, '')
  return nums.length >= 10 ? undefined : 'Phone invalid'
}
