const mongoose = require("mongoose")

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/my_blog")
    .catch(err => console.log(err))
}

mongoose.connection.on("err", err => {
  console.err("몽고DB 연결 에러", err)
})

module.exports = connect