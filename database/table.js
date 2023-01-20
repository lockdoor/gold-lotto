import connectDB from "./connectDB";
import Customer from "@/model/customer";
import Table from "@/model/table";
import mongoose from "mongoose";

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
      .populate({
        path: "tableNumber",
        populate: {path: 'customer'}
    })
    res.status(200).json(table)
  }
  catch(error){
    res.status(400).json(error)
  }
}

export async function putNumber(req, res){
  console.log(req.body)
  try{
    const {tableId, numberId, customer} = req.body
    console.log(req.body)
    await connectDB()
    const customerId = mongoose.Types.ObjectId.isValid(customer)
      ? customer
      : await Customer.create({customerName: customer}).then(res=>res._id)
    console.log(customerId)
    const result = await Table.updateOne(
      {_id: tableId, 'tableNumber._id': numberId},
      {"$set":{"tableNumber.$.customer": customerId}}
    )
    res.status(201).json({message: 'create success'})
  }
  catch(error){
    res.status(400).json(error)
  }
}

export async function putNumberRemoveCustomer(req, res){
  console.log(req.body)
  try{
    const {tableId, numbers, customerId} = req.body
    await connectDB()
    const result = await Table.update(
      {},
      {$unset: {"tableNumber.$[tableNumber].customer": 1}},
      {arrayFilters: [{"tableNumber._id": {$in: numbers}}]}
    )   
    console.log(result)
    res.status(201).json({message: 'update success'})
  }
  catch(error){
    console.log(error)
    res.status(400).json(error)
  }
}

export async function putNumberPayment(req, res){
  console.log(req.body)
  try{
    const {numbers, paymentStatus} = req.body
    await connectDB()
    const result = await Table.update(
      {},
      {$set: {"tableNumber.$[tableNumber].payment": !paymentStatus}},
      {arrayFilters: [{"tableNumber._id": {$in: numbers}}]}
    )
    console.log(result)
    res.status(201).json({message: 'update success'})
  }
  catch(error){
    console.log(error)
    res.status(400).json(error)
  }
}

export async function putSettingTable(req, res){
  // console.log(req.query)
  console.log(req.body)
  try{
    const {tableId} = req.body
    await connectDB()
    const key = Object.keys(req.body)[0]
    const obj = {}
    obj[key] = req.body[key]
    // console.log(obj)
    const result = await Table.updateOne(
      {_id: tableId}, obj
    )
    console.log(result)
    res.status(201).json({message: 'update success'})
  }
  catch(error){
    console.log(error)
    res.status(400).json(error)
  }
}

export async function deleteSettingTable(req, res){
  try{
    const {tableId} = req.query  
    console.log('deleteSettingTable is ', tableId)
    const result = await Table.deleteOne(
      {_id: tableId}
    )
    res.status(201).json({message: 'delete success'})
  }
  catch(error){
    console.log(error)
    res.status(400).json(error)
  }
}