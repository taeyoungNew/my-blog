// mongoDB의 스키마를 선언할때 반드시 mongoose를 가져와야한다.
const mongoose = require("mongoose")

const postsSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    require: true
  },
  userName: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: [true, 'Password required']
  },
  content: {
    type: String,
    require: true
  },
  writeDate: {
    type: String,
    require: true
  }

})

module.exports = mongoose.model("Posts", postsSchema)