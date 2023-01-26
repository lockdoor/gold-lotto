import React from "react";
import { useQuery } from "react-query";
import { getTables } from "@/clientRequest/tables";
import { formatDate } from "@/lib/helper";
import Link from "next/link";
export default function Tables() {
  const { isLoading, isError, data, error } = useQuery("getTables", getTables);
  if (isLoading) return <div>Tables is Loading</div>;
  if (isError) return <div>Tables Got Error {error}</div>;
  return (
    <>
      {data.map((table) => (
        <Link href={`/tables/${table._id}`} key={table._id}>
          <div
            className={
              table.tableIsOpen
                ? "border border-pink-300 shadow-xl my-5 rounded-lg p-5 hover:bg-pink-300 hover:text-white"
                : "border border-gray-300 shadow-xl my-5 rounded-lg p-5 hover:bg-gray-300 text-gray-300 hover:text-white"
            }
          >
            <div>ชื่อตาราง : {table.tableName}</div>
            <div>รายละเอียด: {table.tableDetail}</div>
            <div>ราคา : {table.tablePrice}</div>
            <div>งวดวันที่: {formatDate(table.tableDate)}</div>
          </div>
        </Link>
      ))}
    </>
  );
}
