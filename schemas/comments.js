const mongoose = require("mongoose")

const commentsSchema = {
  postId: {
    type: String, 
    required: true,
    // unique: true
  },
  userId: {
    type: String, 
    required: true,
  },
  nickname: {
    type: String,
    required: true,
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