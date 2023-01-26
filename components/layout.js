import React from "react";
import Navbar from "./navbar";
import Head from "next/head";
export default function Layout({ children, page }) {
  return (
    <>
      <Head>
        <title>Gold Lotto</title>
      </Head>
      <div className=" max-w-sm mx-auto my-3">
        <Navbar page={page} />
        {children}
      </div>
    </>
    
  );
}
