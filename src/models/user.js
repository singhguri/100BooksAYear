const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  // UserName: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  token: { type: String, unique: true },
  status: { type: Boolean, default: true }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
