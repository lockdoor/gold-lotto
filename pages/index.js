import React, { useState } from "react"
import { validateInputText } from "@/lib/helper";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import logo from '@/public/logo-no-background.svg'

export default function Home() {

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

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
      const result = await signIn("credentials", {
        ...payload,
        redirect: false,
      });
      if (!result.error) {        
        setErrorMessage(null);
        router.replace("/tables")
        
      } else {
        setErrorMessage(result.error);
      }
    }
  };
  return (
    <div className=" container h-screen ">
      <Head>
        <title>Gold Lotto</title>
      </Head>
      
      <form 
        onSubmit={onSubmitHandler}
        className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 py-5 px-5 border border-pink-300 rounded-md shadow-xl">
        <Image src={logo} alt="LOGO" className="mb-5"/>
        {/* <div className="text-center font-bold text-2xl ">เข้าสู่ระบบ</div> */}
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
          type={"password"}
          className="user-input"
          id="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="submit-btn" type="submit">เข้าสู่ระบบ</button>
      </form>
    </div>
  )
}
