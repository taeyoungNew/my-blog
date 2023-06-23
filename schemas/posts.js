// mongoDB의 스키마를 선언할때 반드시 mongoose를 가져와야한다.
const mongoose = require("mongoose")

const postsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  nickname: {
    type: "String",
    required: true
  },
  postTitle: {
    type: "String",
    required: true
  },
  content: {
    type: "String",
    required: true
  },  
  writeDate: {
    type: "String",
    required: true
  }

})

module.exports = mongoose.model("Posts", postsSchema)