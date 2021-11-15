const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema(
  {
    city: { type: String },
    zipCode: { type: Number },
    street: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Addree", AddressSchema);