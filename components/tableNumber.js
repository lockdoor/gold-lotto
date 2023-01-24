import React, { useState } from "react";
import Modal from "./modal";
import AutoComplete from "./autoComplete";

export default function TableNumber({ data }) {
  const [showModal, setShowModal] = useState(false);
  const [number, setNumber] = useState(null);
  const onClickSelectNumber = (num) => {
    if(!data.tableIsOpen) return
    setNumber(num);
    setShowModal(true);
  };
  console.log(data)

  return (
    <div className="grid grid-cols-10 max-w-sm mx-auto">
      {data.tableNumbers.map((num) => (
        <div
          key={num._id}
          onClick={() => onClickSelectNumber(num)}
          className={`border border-[${data.tableBorderColor}] aspect-square flex justify-center items-center text-[${data.tableNumberColor}] cursor-pointer`}
        >
          {num.customers.length > 0 ? <span>{data.tableEmoji}</span> : <span>{num.number}</span>}
          
        </div>
      ))}
      <Modal isOpen={showModal} onClose={setShowModal}>
        <AutoComplete number={number} tableId={data._id} setShowModal={setShowModal}/>
      </Modal>
    </div>
  );
}

