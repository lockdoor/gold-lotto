import React from "react";
import Link from "next/link";
export default function Navbar({ page }) {
  return (
    <ul className="flex justify-center bg-pink-300 py-3 rounded-md ">
      <li className="nav-item ">
        <Link
          href={"/dashboard"}
          className={page === "dashboard" ? "text-green-600" : ""}
        >
          หน้าหลัก
        </Link>
      </li>
      <li className="nav-item">
        <Link
          href={"/customers"}
          className={page === "customers" ? "text-green-600" : ""}
        >
          ลูกค้า
        </Link>
      </li>
      <li className="nav-item">
        <Link
          href={"/tables"}
          className={page === "tables" ? "text-green-600" : ""}
        >
          ตาราง
        </Link>
      </li>
    </ul>
  );
}
