import connectDB from "./connectDB";
import Customer from "@/model/customer";

export async function getCustomers(req, res){
  try{
    await connectDB()
    const customers = await Customer.find()      
    res.status(200).json(customers)
  }
  catch(error){
    res.status(400).json(error)
  }
}

// export async function postCustomer(req, res){
//   try{
//     const {customerName} = req.body
//     await connectDB()
//     const customers = await Customer.create({customerName})
    
//     res.status(200).json(customers)
//   }
//   catch(error){
//     res.status(400).json(error)
//   }
// }