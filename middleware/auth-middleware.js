const jwt = require("jsonwebtoken")
const UserSchema = require("../schemas/users")

module.exports = async (req, res, next) => {
  // 클라이언트가 보낸 요청에 있는 cookie를 캐치
  const {Authorization} = req.cookies

  // bearer
  // undefined를 split하게 되면 에러가 뜬다.
  // 만약 쿠키가 없다는 가정을 하여 로직을 짠다.
  // ??:  null병합문자열로 만약 authorization이 null이거나 undefined면 오른쪽의 ""으로 대체를 해준다는 뜻이다.
  // authorization에 값이 있으면 split으로 bearer과 token을 분리해준다.
  const [ authType, authToken ] = (Authorization ?? "").split(" ")

  if(authType != "bearer" || !authToken) {
    res.status(400).json({
      errMsg: "로그인 후에 이용할 수 있는 기능입니다."
    })
    return 
  }
  try {
    // 1) jwt.verify로 authToken의 만료
    // 2) 비밀키로 서버가 발급한 토큰이 맞는지 검증
    const { userId } = jwt.verify(authToken, "auth-secret-key")

    const user = await UserSchema.findById(userId)
    res.locals.user = user
    next()
  } catch (error) {
    console.error(error)
    res.status(400).json({errMessage: "로그인 후에 이용할 수 있는 기능입니다."})
    return
  }
  // next() <= 얘때문에 8시간을 헤맴....
}
