const express = require("express")

const cookieParser = require('cookie-parser')
// route연결
const postsRouter = require('./routes/posts')
const commentsRouter = require("./routes/comments")
const usersRouter = require("./routes/users")
const userAuth = require("./routes/auth")

const app = express()
const port = 3000


// 몽고DB의 컬렉션과 가져오기
const connect = require("./schemas")
connect()

// 미들웨어
app.use(express.json())
app.use(cookieParser())
app.use("/api", [postsRouter, commentsRouter, usersRouter, userAuth])


// 실행이 되었을때 서버에서 blog 보여주기
app.get("/", async (req, res) => {
 res.json("<h1>민태영의 블로그</h1>")
})


app.listen(port, () => {
  console.log(`포트번호${port}번 실행`)
})