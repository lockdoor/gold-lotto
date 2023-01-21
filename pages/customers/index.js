import React from "react";
import Layout from "@/components/layout";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getCustomersTables } from "@/clientRequest/customers";
import { putNumberPayment } from "@/clientRequest/numberTable"

export default function CustomersIndex() {
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
    const numbers = []
    for(const table of customer.tables){
      for(const number of table.numbers){
        numbers.push(number)
      }
    }
    const payload = {
      
        paymentStatus: numbers[0].payment,
        numbers: numbers.map(num=>num._id)}
      paymentMutation.mutate(payload)
    
    
    // console.log(payload)
  }
  if (isLoading) return <div>Customers is Loading</div>;
  if (isError) return <div>Customers Got Error {error}</div>;
  // console.log(data);
  return (
    <Layout page={"customers"}>
      <main>
        {data.map((customer) => (
          <div
            key={customer._id}
            className="flex my-5 p-2 border border-pink-200 rounded-lg shadow-lg shadow-pink-300"
          >
            <div className=" w-2/12 px-2 flex items-center border-r border-pink-300">
              {customer.customerName}
            </div>
            <div className="w-8/12 px-2 ">
              {customer.tables.map((table) => (
                <div
                  key={table._id._id}
                  className="flex border-b border-pink-300 py-2 last-of-type:border-none"
                >
                  <div className={`w-3/12 px-2 border-r border-pink-300`}>
                    {table._id.tableName}
                  </div>
                  <div className="flex-1 flex px-2">
                    {table.numbers.map((number) => (
                      <div key={number._id} className={`mx-1 ${number.payment ? 'text-green-500' : 'text-red-500'}`}>
                        {number.number}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div 
              onClick={()=>onClickPayment(customer)}
              className={`w-2/12 flex items-center justify-center border-l border-pink-300 ${customer.tables[0]?.numbers[0].payment ? 'text-green-500' : 'text-red-500'} cursor-pointer`}>
              {customer.tables.reduce((a, b) => a + (b._id.tablePrice * b.numbers.length), 0)}
            </div>
          </div>
        ))}
      </main>
    </Layout>
  );
}
