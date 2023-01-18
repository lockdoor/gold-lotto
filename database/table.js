import connectDB from "./connectDB";
import Table from "@/model/table";

export async function postTable(req, res){
  try{
    const {tableName, tableDetail, tablePrice, tableDate} = req.body
    console.log(req.body)
    await connectDB()
    const tableNumber = []
    for(let i = 0; i <= 9; i++){
      for(let n = 0; n <=9; n++){
        const number = i.toString() + n.toString()
        tableNumber.push({number})
      }
    }
    const result = await Table.create({
      tableName, tableDetail, tablePrice, tableDate, tableNumber
    })
    res.status(201).json({message: 'create success'})
  }
  catch(error){
    res.status(400).json(error)
  }
}

export async function getTables(req, res){
  try{
    await connectDB()
    const tables = await Table.find()
      .select('tableName tableDetail tablePrice tableDate')
      .sort('-tableDate')
    res.status(200).json(tables)
  }
  catch(error){
    res.status(400).json(error)
  }
}

export async function getTable(req, res){
  try{
    const {tableId} = req.query
    await connectDB()
    const table = await Table.findById(tableId)
    res.status(200).json(table)
  }
  catch(error){
    res.status(400).json(error)
  }
}