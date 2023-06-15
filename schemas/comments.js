const mongoose = require("mongoose")

const commentsSchema = {
  postId: {
    type: String, 
    required: true,
    // unique: true
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
  },
  content: {
    type: String,
    required: true
  },
  writeDate: {
    type: String,
    required: true
  }
}

module.exports = mongoose.model("Comments", commentsSchema)