import { postCustomer, getCustomers } from "@/database/customer"

export default async function handler(req, res){
  switch(req.method){
    // case 'POST': 
    //   postCustomer(req, res)
    //   break
    case 'GET': 
      getCustomers(req, res)
      break
    // case 'PUT': 
    //   putBet(req, res)
    //   break
    // case 'DELETE': 
    //   deleteBet(req, res)
    //   break
    default:
      res.setHeader('Allow', ['GET'])
      // res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}