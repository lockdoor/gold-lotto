import axios from "axios";
const BASE_URL = "/api/tables";

export async function getTables() {
  const result = await axios
    .get(BASE_URL)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}

export async function getTable({queryKey}){
  const[_, tableId] = queryKey
  const result = await axios
    .get(`${BASE_URL}/${tableId}`)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}

export async function postTable(payload) {
  const result = await axios
    .post(BASE_URL, payload)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}