import { getTable, putSettingTable, deleteSettingTable } from "@/database/table"

export default async function handler(req, res){
  switch(req.method){
    case 'GET': 
      getTable(req, res)
      break
    case 'PUT': 
      putSettingTable(req, res)
      break
    case 'DELETE': 
      deleteSettingTable(req, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}