// const Schema=require("mongoose").Schema;//schema est um constructeur qui nous constriut un modèle
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const UserSchema = new Schema(
  {
    firstName: { type: String, maxlength: 64 },
    lastName: { type: String, maxlength: 64 },
    email: { type: String, unique: true, index: true, lowercase: true },
    password: { type: String, minlength: 8, maxlength: 1024 },
    IDCard: { type: Number, unique: true, index: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    phoneNumber: { type: String, maxlength: 18 },
    isActive: { type: Boolean, default: false },
    signature: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);
UserSchema.plugin(uniqueValidator, {
  message: "is not unique",
});
UserSchema.pre("validate", function (next) {
  if (!this.signature) {
    this.generateSignature();
  }
  next();
});

UserSchema.methods.generateSignature = function () {
  this.signature =
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36) +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};
module.exports = mongoose.model("User", UserSchema);
//n'importe quel model on l'exporte b mongoose.model    