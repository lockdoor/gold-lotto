import React, { useState } from "react";
import Layout from "@/components/layout";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getCustomersTables, putCustomerName, deleteCustomer } from "@/clientRequest/customers";
import { putNumberPayment } from "@/clientRequest/numberTable"
import Modal from "@/components/modal";
import Link from "next/link";

export default function CustomersIndex() {
  const [showModal, setShowModal] = useState(false)
  const [selectCustomer, setSelectCustomer] = useState({})
  const queryClient = useQueryClient()
  const paymentMutation = useMutation(putNumberPayment, {
    onSuccess: () => {
      queryClient.prefetchQuery("getCustomersTables",
      getCustomersTables)
    }
  })
  
  const { isLoading, isError, data, error } = useQuery(
    "getCustomersTables",
    getCustomersTables
  );

  const onClickPayment = (customer) => {
    const numbers = [];
    for (const table of customer.tables) {
      for (const number of table.numbers) {
        numbers.push(number);
      }
    }
    const payload = {
      paymentStatus: numbers[0].payment,
      numbers: numbers.map((num) => num.paymentId),
    };
    paymentMutation.mutate(payload)

    console.log(payload)
  };

  const onClickCustomerName = (customer) => {
    setSelectCustomer(customer)
    setShowModal(true)
  }
  if (isLoading) return <div>Customers is Loading</div>;
  if (isError) return <div>Customers Got Error {error}</div>;

  return (
    <Layout page={"customers"}>
      <main className=" max-w-sm mx-auto">
        {data.map((customer) => (
          <div
            key={customer._id}
            className="flex my-5 p-2 border border-pink-200 rounded-lg shadow-lg shadow-pink-300"
          >
            <div className=" w-2/12 px-2 flex items-center border-r border-pink-300">
              <span className=" cursor-pointer"
                onClick={()=>onClickCustomerName(customer)}
              >{customer.customerName}</span>
            </div>
            <div className="w-8/12 px-2 ">
              {customer.tables.map((table) => (
                <div
                  key={table._id._id}
                  className="flex border-b border-pink-300 py-2 last-of-type:border-none"
                >
                  <div className={`w-3/12 px-2 border-r border-pink-300`}>
                    <Link href={`/tables/${table._id._id}`}>{table._id.tableName}</Link>
                    
                  </div>
                  <div className="flex-1 flex px-2">
                    {table.numbers.map((number) => (
                      <div
                        key={number._id}
                        className={`mx-1 ${
                          number.payment ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {number.number}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div
              onClick={() => onClickPayment(customer)}
              className={`w-2/12 flex items-center justify-center border-l border-pink-300 ${
                customer.tables[0]?.numbers[0].payment
                  ? "text-green-500"
                  : "text-red-500"
              } cursor-pointer`}
            >
              {customer.tables.reduce(
                (a, b) => a + b._id.tablePrice * b.numbers.length,
                0
              )}
            </div>
          </div>
        ))}
      </main>
      <Modal isOpen={showModal} onClose={setShowModal}>
        <ContentEditCustomerName customer={selectCustomer} onClose={setShowModal}/>
      </Modal>
    </Layout>
  );
}

const ContentEditCustomerName = ({customer, onClose}) => {
  const [name, setName] = useState(customer.customerName)
  const queryClient = useQueryClient()
  const putCustomerNameMutation = useMutation(putCustomerName, {
    onSuccess: () => {
      queryClient.prefetchQuery("getCustomersTables",
      getCustomersTables)
      onClose(false)
    }
  })
  const deleteCustomerMutation = useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.prefetchQuery("getCustomersTables",
      getCustomersTables)
      onClose(false)
    }
  })

  const onClickBtn = () => {
    if(name === customer.customerName) return
    const payload = {
      customerId: customer._id,
      customerName: name
    }
    putCustomerNameMutation.mutate(payload)
  }
  const onClickDelete = () => {
    const payload = {customerId: customer._id}
    deleteCustomerMutation.mutate(payload)
  }
  return (
    <div>
      <div className="text-center">แก้ไขชื่อลูกค้า</div>
      <input type={'text'} className='user-input' value={name} onChange={e=>setName(e.target.value)}/>
      <div className="flex gap-2">
        <button onClick={onClickDelete} className="submit-btn" style={{backgroundColor: 'red'}}>ลบ</button>
        <button onClick={onClickBtn} className="submit-btn">บันทึก</button>
      </div>
      
    </div>
  )
} 
