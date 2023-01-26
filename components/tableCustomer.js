import React, { useEffect, useState, useRef } from "react";
import { BsTrash } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { AiOutlineRollback } from "react-icons/ai";
import { useQueryClient, useMutation } from "react-query";
import { putNumberRemoveCustomer, putNumberPayment } from "@/clientRequest/numberTable";
import { getTable } from "@/clientRequest/tables";

export default function TableCustomer({ data, setCountCustomer }) {
  const [tableCustomer, setTableCustomer] = useState([]);

  const makeTableCustomer = () => {
    const { tableNumbers } = data;
    let reserve = tableNumbers.filter((n) => n.customers.length > 0);
    
    // 1. หารายชื่อลูกค้าทั้งหมด
    let customers = []
    for (const number of reserve){
      for (const customerss of number.customers){
        customers.push(customerss.customer._id)
      }
    }
    
    // 2. สร้าง set customers
    customers = new Set(customers);
    setCountCustomer(customers.size)

    // 3. ใช้ customer loop หาตัวเลข
    let result = [];
    for (const customer of customers) {
      let numbers = []
      for(const numberss of reserve){
             
        for (const c of numberss.customers){
          if(c.customer._id === customer){
            let obj = {}   
            obj.number = numberss.number
            obj.customerName = c.customer.customerName,
            obj.paymentId = c._id
            obj.payment = c.payment
            numbers.push(obj)
          }
        }
      }

      result.push({
        customerId: customer,
        numbers,
        customerName: numbers[0].customerName,
      })
    }

    result.sort((a, b) => b.numbers.length - a.numbers.length)
    return result;
  };

  useEffect(() => {
    setTableCustomer(makeTableCustomer());
  }, [data]);

  return (
    <div className="my-5 max-w-sm mx-auto">
      {tableCustomer.map((e, i) => (
        <Card key={i} customer={e} tableId={data._id} tableIsOpen={data.tableIsOpen}/>
      ))}
    </div>
  );
}

function useOutsideAlerter(ref, setEdit) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        setEdit(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const Card = ({ customer, tableId, tableIsOpen }) => {
  const [edit, setEdit] = useState(false);
  const [selectNumber, setSelectNumber] = useState([]);
  const queryClient = useQueryClient()
  const deleteMution = useMutation(putNumberRemoveCustomer, {
    onSuccess: (response) => {
      queryClient.prefetchQuery(['getTable', tableId], getTable)
      setSelectNumber([])
      setEdit(false)
    }
  })
  const paymentMutation = useMutation(putNumberPayment, {
    onSuccess: (response) => {
      queryClient.prefetchQuery(['getTable', tableId], getTable)
      setSelectNumber([])
      setEdit(false)
    }
  })

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setEdit);

  const onClickEdit = () => {
    if(!tableIsOpen) return
    setEdit(true)
  }
  const onClickCancel = () => {
    setEdit(false)
    setSelectNumber([])
  }

  const onChangeCheckbox = (number, e) => {
    if (e.target.checked) {
      setSelectNumber(prev => ([...prev, number]))
    } else {
      setSelectNumber(prev => {
        const arr = prev.filter(n => n.paymentId !== number.paymentId)
        return arr
      })
    }
  };

  const onClickDelete = () => {
    if(selectNumber.length === 0) return
    const payload = {
      tableId,
      customerId: customer.customerId,
      numbers: selectNumber.map(n=> n.paymentId)
    }
    deleteMution.mutate(payload)
  }

  return (
    <div
      ref={wrapperRef}
      className="flex shadow-xl items-center border border-slate-200 my-2 py-3 px-2 rounded-md"
    >
      <div className=" w-3/12 border-r border-slate-200">
        <div>{customer.customerName}</div>
      </div>
      <div className="flex flex-wrap w-8/12 px-2 border-r border-slate-200">
        {customer.numbers.map((n) => (
          <div key={n.paymentId} className="mr-2">
            {edit ? (
              <>
                <input
                  type={"checkbox"}
                  id={n.paymentId}
                  onChange={(e) => onChangeCheckbox(n, e)}
                />
                <label htmlFor={n.numberId}
                  className={`${n.payment ? 'text-green-500' : 'text-red-500'}`}
                >{n.number}</label>
              </>
            ) : (
              <span className={`${n.payment ? 'text-green-500' : 'text-red-500'}`}>{n.number}</span>
            )}
          </div>
        ))}
      </div>
      <div className=" w-1/12 px-2">
        {edit ? (
          <>
            <button onClick={onClickDelete}>
              <BsTrash size={20} color="red" />
            </button>
            <button onClick={onClickCancel}>
              <AiOutlineRollback size={20} color="green" />
            </button>
          </>
        ) : (
          <button onClick={onClickEdit}>
            <CiEdit size={20} color="brown" />
          </button>
        )}
      </div>
    </div>
  );
};
