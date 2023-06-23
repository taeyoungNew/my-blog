const express = require("express")
const UserSchema = require("../schemas/users")
const router = express.Router()

// 회원가입 API
router.post('/users', async(req, res) => {
  // 객체구조분해할당으로 body값을 상수에 할당
  const { email, nickname, password, confirmPassword } = req.body
  const passwordRex = /^[]{4,}$/
  const nickNameRex = /^[a-zA-Z0-9].{3,}$/
  console.log('nickNameRex.test(nickname) = ', nickNameRex.test(nickname))

  // 닉네임 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성
  if(!nickNameRex.test(nickname)) {
    res.status(400).json({errMsg: "닉네임은 최소 3자이상, 알파벳 대소문자 숫자를 포함하여야합니다."})
    return 
  }

  // 패스워드는 최소 4자, 닉네임과 같은 값이 포함되어ㅏ 있으면 에러
  if(password.includes(nickname)) {
    res.status(400).json({errMsg: "패스워드안에 닉네임이 포함되어있으면 안됩니다."})
    return
  } else if(passwordRex.test(password)) {
    res.status(400).json({errMsg: "패스워드는 최소 4자리 이상이어야합니다."})
    return
  }

  // 패스워드와 패스워드 확인 검증
  if(password !== confirmPassword ) {
    res.status(400).json({errMsg: "비밀번호확인이 일치하지 않습니다."})
    return
  }

  // email이나 nickname이 같은것이 있는지 확인하기
  // 같은것이 있으면 에러메세지 반환
  const isExUser = await UserSchema.findOne({
    $or: [{email}, {nickname}]
  })
  if(isExUser) {
    res.status(400).json({errMsg: "이미 존재하는 이메일이거나 닉네임입니다."})
    return 
  }

  const User = new UserSchema({email, nickname, password})
  await User.save() 

  return res.status(201).json({})

})

module.exports = router