import React from 'react'
import { useQuery } from 'react-query'
import { getTable } from '@/clientRequest/tables'
import Layout from '@/components/layout'
import { formatDate } from '@/lib/helper'
import TableNumber from '@/components/tableNumber'
import TableCustomer from '@/components/tableCustomer'
export default function Table({tableId}) {

  const {isLoading, isError, data, error} = useQuery(['getTable', tableId], getTable)
  if (isLoading) return <div>Table is Loading</div>;
  if (isError) return <div>Table Got Error {error}</div>;
  // console.log(data)
  return (
    <Layout page={'tables'}>
      <main className='mt-5'>
        <div className='text-center text-2xl'>{data.tableName}</div>
        <div className='text-center'>{data.tableDetail}</div>
        <div className='text-center'>{data.tablePrice}</div>
        <div className='text-center'>{formatDate(data.tableDate)}</div>
        <TableNumber data={data} />
        <TableCustomer data={data} />
      </main>
    </Layout>
    
  )
}

export async function getServerSideProps(context){
  const tableId = context.query.tableId
  return {
    props: {tableId}
  }
}
