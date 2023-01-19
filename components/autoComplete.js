import React, {useState} from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import {getCustomers} from '@/clientRequest/customers'
import { getTable } from '@/clientRequest/tables'
import { putNumber } from '@/clientRequest/numberTable'

export default function AutoComplete({number, tableId, setShowModal}) {
  // console.log({number, tableId})
  // console.log(number)
  const [showAuto, setShowAuto] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [autoC, setAutoC] = useState([])
  const [inputValue, setInputValue] = useState(number.customer?.customerName || '')
  const [errorMessage, setErrorMessage] = useState('')
  const {isLoading, isError, data, error} = useQuery('getCustomers', getCustomers)
  const queryClient = useQueryClient()
  const putMutation = useMutation(putNumber, {
    onSuccess: (response) => {
      if(response.errors){
        setErrorMessage(response.message)
      }else{
        queryClient.prefetchQuery(['getTable', tableId], getTable)
        setInputValue('')        
        setErrorMessage('')
        setShowAdd(false)
        setShowAuto(false)
        setShowModal(false)
      }  
    }
  })
  if (isLoading) return <div>Customers is Loading</div>;
  if (isError) return <div>Customers Got Error {error}</div>;
  
  const updateNumberNewCustomer = () => {
    const payload = {
      tableId,
      numberId: number._id,
      customer: inputValue
    }
    putMutation.mutate(payload)
  }
  const updateNumber = (customer) => {
    const payload = {
      tableId,
      numberId: number._id,
      customer: customer._id
    }
    putMutation.mutate(payload)
  }

  const onChangeHandler = (e) => {
    setInputValue(e)
    
    const regex = new RegExp(e.toLowerCase(), 'g')
    const auto = data.filter(d=> regex.test(d.customerName))
    if(e===''){
      setAutoC([])
      setShowAdd(false)
      setShowAuto(false)
    }
    else if(auto.length === 0){
      setAutoC([])
      setShowAdd(true)
      setShowAuto(false)
    }
    else {
      setAutoC(auto)
      setShowAdd(false)
      setShowAuto(true)
    }
    console.log(auto)
  }
  // console.log(data)
  return (
    <div>
      <div className="text-2xl text-center">{number.number}</div>
      {errorMessage && <div>{errorMessage}</div>}
      <input 
      placeholder='ป้อนชื่อลูกค้า'
      className='block max-w-lg mx-auto border border-gray-300 rounded-lg outline-none focus:border-gray-500 text-lg p-2'
      value={inputValue}
      onChange={e=>onChangeHandler(e.target.value)}/>
      {showAdd && (
        <div className=' cursor-pointer text-start p-2 border border-gray-300 rounded-lg shadow-lg'
          onClick={updateNumberNewCustomer}
        >
          เพิ่ม "{inputValue}"
        </div>
      )}
      {
        showAuto && autoC.map(a=>(
          <div key={a._id}
          onClick={()=>updateNumber(a)}
          className=' cursor-pointer text-start p-2 border border-gray-300 rounded-lg shadow-lg'
          >{a.customerName}</div>
        ))
      }
    </div>
  )
}
