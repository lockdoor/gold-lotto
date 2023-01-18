export function validateInputText (text, label){
  const regex = /\s/g
  let test = text.trim()
  if(test === '' || regex.test(test)){
    return `${label} wrong!`
  }
  return null
}

export function formatDate(dateString) {
  const option = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", option);
}