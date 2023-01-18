import React from 'react'

export default function TableNumber({data}) {

  return (
    <div className='grid grid-cols-10 max-w-sm mx-auto'>
      {data.tableNumber.map(num=>(
        <div key={num._id} 
          className='border border-pink-400 aspect-square flex justify-center items-center text-green-500'
          >{num.number}</div>
      ))}
    </div>
  )
}
