import { putNumber } from "@/database/table"

export default async function handler(req, res){
  switch(req.method){
    // case 'POST': 
    //   postTable(req, res)
    //   break
    // case 'GET': 
    //   getTables(req, res)
    //   break
    case 'PUT': 
      putNumber(req, res)
      break
    // case 'DELETE': 
    //   deleteBet(req, res)
    //   break
    default:
      res.setHeader('Allow', ['PUT'])
      // res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}