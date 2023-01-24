import {Schema, models, model, Types} from "mongoose";
const numberSchema = new Schema({
  number: {type: String, required: true},
  customers: [
    {
      customer: {type: Types.ObjectId, ref: 'Customer'},
      payment: {type: Boolean, default: false}
    }
  ],  
})
const tableSchema = new Schema({
  tableDate: {type: Date, required: true},
  tableName: {type: String, required: true},
  tableDetail: {type: String, required: true},
  tablePrice: {type: Number, required: true},
  tableNumbers: [numberSchema],
  tableEmoji: {type: String, required: true, default: "🍎"},
  tableIsOpen: {type: Boolean, required: true, default: true},
  tableNumberColor: {type: String, required: true, default: '#22c55e'},
  tableBorderColor: {type: String, required: true, default: '#f472b6'},
})
const Table = models.Table || new model("Table", tableSchema)
export default Table