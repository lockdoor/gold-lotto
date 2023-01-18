export function validateInputText (text, label){
  const regex = /\s/g
  let test = text.trim()
  if(test === '' || regex.test(test)){
    return `${label} wrong!`
  }
  return null
}