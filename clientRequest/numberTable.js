import axios from "axios";
const BASE_URL = "/api/tables";

export async function putNumber(payload) {
  const result = await axios
    .put(`${BASE_URL}/numbers`, payload)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}

export async function putNumberRemoveCustomer(payload) {
  const result = await axios
    .put(`${BASE_URL}/customers`, payload)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}

export async function putNumberPayment(payload) {
  const result = await axios
    .put(`${BASE_URL}/payment`, payload)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}