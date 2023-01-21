import axios from "axios";
const BASE_URL = '/api/customers'

export async function getCustomers(){
  const result = await axios
    .get(BASE_URL)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}

export async function getCustomersTables(){
  const result = await axios
    .get(`${BASE_URL}/customersTables`)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}

