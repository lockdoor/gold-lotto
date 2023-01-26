import axios from "axios";

export const putUserPassword = async (payload) => {
  // console.log(payload)
  const result = await axios
    .put('/api/user', payload)
    .then((res) => res.data)
    .catch((error) => error.response.data);
  return result;
}