import { getCustomers } from "@/database/customer"

export default async function handler(req, res){
  switch(req.method){
    case 'GET': 
      getCustomers(req, res)
      break   
    default:
      res.setHeader('Allow', ['GET'])
      // res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}