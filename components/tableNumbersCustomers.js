import React, { useEffect, useState } from 'react'

export default function TableNumbersCustomers({data, setCountNumber}) {
  const [numbers, setNumbers] = useState([])
  const init = () => {
    // console.log(data)
    const {tableNumbers} = data
    const numbers = tableNumbers.filter(n => n.customers.length > 0)
    // console.log(numbers)
    setCountNumber(numbers.length)
    return numbers
  }
  useEffect(() => {
    setNumbers(init())
  }, [data])
  return (
    <div className='my-5'>
      {numbers.map(n => (
        <div key={n._id} className="flex shadow-xl items-center border border-slate-200 my-2 py-3 px-2 rounded-md">
          <div className=" w-3/12 border-r border-slate-200">
            {n.number}
          </div>
          <div className="flex flex-wrap w-9/12 px-2 border-r border-slate-200">
        {n.customers.map((c) => (
          <div key={c.customer._id} className="mr-2">
            {c.customer.customerName}
          </div>
        ))}
      </div>
        </div>
      ))}
    </div>
  )
}
