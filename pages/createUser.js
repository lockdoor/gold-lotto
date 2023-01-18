import React, { useState } from "react";
import axios from "axios";
import { validateInputText } from "@/lib/helper";
import { useRouter } from "next/router";
export default function CreateUser() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      username: username.trim(),
      password: password.trim(),
    };
    if (validateInputText(username, "username")) {
      setErrorMessage(validateInputText(username, "username"));
      return;
    } else if (validateInputText(password, "password")) {
      setErrorMessage(validateInputText(password, "password"));
      return;
    } else {
      setErrorMessage("");
      // console.log(payload);
      await axios
        .post("./api/createUser", payload)
        .then(() => router.replace("/"))
        .catch((error) => {
          if (error.response.data.hasError) {
            setErrorMessage(error.response.data?.message);
          }
        });
    }
  };
  return (
    <div className=" container h-screen ">
      <form
        onSubmit={onSubmitHandler}
        className=" absolute top-1/3 left-1/2 -translate-x-1/2 -traslate-y-1/2 w-96 py-5 px-5 border border-pink-300 rounded-md shadow-xl"
      >
        <div className="text-center font-bold text-2xl ">สร้างผู้ใช้</div>
        {errorMessage && <div>{errorMessage}</div>}
        <label htmlFor="username">ชื่อผู้ใช้ : </label>
        <input
          type={"text"}
          className="user-input"
          id="username"
          value={username}
          required
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="password">รหัสผ่าน : </label>
        <input
          type={"text"}
          className="user-input"
          id="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="submit-btn" type="submit">
          สร้างผู้ใช้
        </button>
      </form>
    </div>
  );
}
