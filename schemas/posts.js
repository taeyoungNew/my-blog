// mongoDB의 스키마를 선언할때 반드시 mongoose를 가져와야한다.
const mongoose = require("mongoose")

const postsSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    // trim: true
  },
  content: {
    type: String,
    required: true
  },
  writeDate: {
    type: String,
    required: true
  }

})

module.exports = mongoose.model("Posts", postsSchema)