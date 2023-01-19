import {Schema, models, model} from "mongoose";

const customerSchema = new Schema({
  customerName: {type: String, required: true, unique: true, trim: true}
})
const Customer = models.Customer || new model("Customer", customerSchema)
export default Customer