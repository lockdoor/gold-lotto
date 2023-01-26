import React, { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { postTable, getTables } from "@/clientRequest/tables";

export default function FormAddTable() {
  const [btnAddTable, setBtnAddTable] = useState(true);
  const [tableName, setTableName] = useState("");
  const [tableDetail, setTableDetail] = useState("");
  const [tablePrice, setTablePrice] = useState("");
  const [tableDate, setTableDate] = useState("");
  const [errorMessage, setErrorMessage] = useState('')
  const queryClient = useQueryClient()
  const postTableMutation = useMutation(postTable, {
    onSuccess: (response) => {
      if(response.errors){
        setErrorMessage(response.message)
      }else{
        queryClient.prefetchQuery('getTables', getTables)
        setTableName('')
        setTableDetail('')
        setTablePrice('')
        setTableDate('')
        setErrorMessage('')
        setBtnAddTable(true)
      }      
    }
  })
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = {
      tableName, tableDetail, tablePrice, tableDate
    }
    postTableMutation.mutate(payload)
  };
  return (
    <>
      {btnAddTable ? (
        <button
          type="button"
          onClick={() => setBtnAddTable(false)}
          className="w-52 bg-green-300 py-3 my-5 rounded-lg block mx-auto hover:bg-green-600 hover:text-white hover:underline"
        >
          เพิ่มตาราง
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setBtnAddTable(true)}
            className="w-52 bg-red-300 py-3 my-5 rounded-lg block mx-auto hover:bg-red-600 hover:text-white hover:underline"
          >
            ยกเลิกเพิ่มตาราง
          </button>
          <form
            onSubmit={onSubmitHandler}
            className=" max-w-sm mx-auto shadow-xl p-5 rounded-lg"
          >
            {errorMessage && <div>{errorMessage}</div>}
            <label htmlFor="tableName">ชื่อตาราง: </label>
            <input
              id="tableName"
              type={"text"}
              className=" user-input"
              value={tableName}
              required
              onChange={(e) => setTableName(e.target.value)}
            />
            <label htmlFor="tableDetail">รายละเอียด: </label>
            <textarea
              id="tableDetail"
              className="user-input"
              value={tableDetail}
              required
              onChange={(e) => setTableDetail(e.target.value)}
            />
            <label htmlFor="tablePrice">ราคา: </label>
            <input
              id="tablePrice"
              type={"number"}
              className="user-input"
              value={tablePrice}
              required
              onChange={(e) => setTablePrice(e.target.value)}
            />
            <label htmlFor="tableDate">งวดวันที่: </label>
            <input
              id="tableDate"
              type={"date"}
              className="user-input"
              value={tableDate}
              required
              onChange={(e) => setTableDate(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              เพิ่มตาราง
            </button>
          </form>
        </>
      )}
    </>
  );
}
