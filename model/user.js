import {Schema, models, model} from "mongoose";
const userSchema = new Schema({
  username: {type: String, trim: true, unique: true, required: true},
  password: {type: String, trim: true, required: true},
  tableLimit: {type: Number, required: true, default: 2}
})
const User = models.User || new model("User", userSchema)
export default User