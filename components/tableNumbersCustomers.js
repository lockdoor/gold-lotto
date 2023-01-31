import React, { useEffect, useState } from "react";

export default function TableNumbersCustomers({ data, setCountNumber }) {
  const [numbers, setNumbers] = useState([]);
  const init = () => {
    const { tableNumbers } = data;
    const numbers = tableNumbers.filter((n) => n.customers.length > 0);
    setCountNumber(numbers.length);
    return numbers;
  };
  const onClickSortDuplicate = () => {
    setNumbers(prev => {
      return [...prev].sort((a, b)=>b.customers.length - a.customers.length)
    })
  }
  useEffect(() => {
    setNumbers(init());
  }, [data]);
  return (
    <div className="my-5 max-w-sm mx-auto">
      <div className="flex justify-center gap-4 mb-5">
        <button 
          onClick={()=>setNumbers(init())}
          className="bg-green-300 py-2 flex-1 rounded-md text-white hover:bg-green-500">
          เรียงตามลำดับตัวเลข
        </button>
        <button
          onClick={onClickSortDuplicate}
          className="bg-green-300 py-2 flex-1 rounded-md text-white hover:bg-green-500"
        >เรียงตามเลขซ้ำ</button>
      </div>
      {numbers.map((n) => (
        <div
          key={n._id}
          className="flex shadow-xl items-center border border-slate-200 my-2 py-3  rounded-md"
          style={{ color: n.customers.length > 1 ? "red" : "inherit" }}
        >
          <div className=" w-10 text-center border-r px-2  border-slate-200">
            {n.number}
          </div>
          <div className="flex flex-wrap  px-2  border-slate-200">
            {n.customers.map((c) => (
              <span
                key={c.customer._id}
                className="mr-2 after:content-[','] last-of-type:after:content-none"
              >
                {c.customer.customerName}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
