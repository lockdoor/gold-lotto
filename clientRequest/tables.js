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

export async function putSettingTable(payload){
  const {tableId, } = payload
  console.log(payload)
  const result = await axios
    .put(`${BASE_URL}/${tableId}`, payload)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}

export async function deleteSettingTable(payload){
  const {tableId, } = payload
  console.log(payload)
  const result = await axios
    .delete(`${BASE_URL}/${tableId}`, {data: payload})
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}