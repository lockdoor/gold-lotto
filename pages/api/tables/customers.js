import { putNumberRemoveCustomer } from "@/database/table"

export default async function handler(req, res){
  switch(req.method){
    case 'PUT': 
      putNumberRemoveCustomer(req, res)
      break 
    default:
      res.setHeader('Allow', ['PUT'])
      // res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}