const express = require("express")
const router = express.Router()
const UserSchema = require("../schemas/users")
const jwt = require("jsonwebtoken")

// 로그인 api
router.post('/auth', async (req,res) => {
  const { email, password } = req.body
  // 1. 먼저 로그인했을 때 입력한 email의 사용자의 정보를 가져온다
  const user = await UserSchema.findOne({email})

  // 2. 사용자의 정보가 만약없거나 입력한 password와 사용자정보안에 저장되어있는
  // password가 일치하지 않았을 때 에러메세지를 반환한다.
  if(!user || user.password !== password) {
    res.status(400).json({
      errMsg: "로그인에 실패하였습니다."
    })
    return 
  }

  // 3. 위의 조건이 모두 맞으면 JWT를 생성한다.
  const token = jwt.sign({ userId: user.userId }, "auth-secret-key", {
    expiresIn: "1h"
  })

  // 4. bearer타입으로 token을 전달
  res.cookie('Authorization', `bearer ${token}`)
  res.status(200).json({token})


})

module.exports = router