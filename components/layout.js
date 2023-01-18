import React from "react";
import Navbar from "./navbar";

export default function Layout({ children, page }) {
  return (
    <div className="sm:container mx-5 my-3">
      <Navbar page={page} />
      {children}
    </div>
  );
}
