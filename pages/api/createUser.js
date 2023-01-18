import { validateInputText } from "@/lib/helper"
import connectDB from "@/database/connectDB"
import User from "@/model/user"
import bcrypt from "bcrypt"
export default async function handler(req, res){
  if (req.method !== 'POST'){
    res.status(400).json({message: `allow post only, ${req.method} not allow`})
    return
  }
  const {username, password} = req.body
  if(validateInputText(username, 'username')){
    res.status(400).json({hasError: true, message: 'username wrong!'})
    return
  } else if(validateInputText(password, 'password')){
    res.status(400).json({hasError: true, message: 'password wrong!'})
    return
  }else {
    try{
      await connectDB()
      const user = await User.find()
      if(user.length){
        res.status(400).json({hasError: true, message: 'user must have only one'})
      }else{
        const passwordHass = await bcrypt.hash(password, 8)
        const result = await User.create({username, password: passwordHass})
        res.status(201).json(result)
      }
      
    }catch (error) {
      res.status(400).json(error)
    } 
    
  } 
}