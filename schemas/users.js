const mongoose = require("mongoose")

const User = new mongoose.Schema({
  email: {
    type: "String",
    required: true,
    unique: true
  },
  password: {
    type: "String",
    required: true
  },
  nickname: {
    type: "String",
    required: true,
    unique: true
  },

})

// User에 virtural값을 할당
User.virtual("userId").get(function () {
  return this._id.toHexString()
})

User.set("toJSON", {
  virtuals: true
})

module.exports = mongoose.model("User", User)