const express = require('express')
const router = express.Router()
const Posts = require("../schemas/posts")
const Comments = require("../schemas/comments")
const getDate = require("../modules/date")
const authMiddleware = require("../middleware/auth-middleware")

// 댓글 달기
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    // 로그인한 사용자의 ID
    const user = res.locals.user
    let { content } = req.body

    const postId = req.params.postId
    
    // // 댓글을 달고자 하는 게시글이 있는지 확인
    const check = await Posts.findOne({_id: postId})
    // 만약 댓글을 달고자 한느 게시글이 없으면 아래의 에러를 반환 
    if(check === null) {
      res.status(400).json({errMsg : "해당 게시글이 없습니다."})
      return
    }
    // 댓글 내용이 비어있으면 아래의 에러를 반환
    if(content.replace(/\s| /gi, "").length == 0) {
      res.status(400).json({errMsg : "댓글 내용을 입력해주세요"})
      return
    } 
    const reuslt = await Comments.create({
      postId: postId,
      userId: user._id,
      nickname: user.nickname,
      content: content,
      writeDate: getDate()
    })
    res.status(201).json({"댓글작성완료": reuslt})
    
  } catch (error) {
    res.status(400).json(error)
  }
})

// 댓글 조회하기 게시글의 id를 parammeter로 받고 해당되는 댓글의 목록을 가져온다.
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    console.log('오름차순 = ')
    // 게시글의 id값을 받는다.
    const postId = req.params.postId
    // 게시글의 id값을 가지고 있는 댓글을 모두 가져온다.
    const comments = await Comments.find({postId : postId}, {password:false})
    result = comments.sort((a, b) => {
      return Number(b.writeDate.replace(/\-|:|\s/g, "",)) - Number(a.writeDate.replace(/\-|:|\s/g, ""))
    })
    console.log('result = ', result)

    // 게시글에 댓글이 없으면 아래의 메세지를 출력한다.
    if(comments.length === 0) {
      res.status(401).send(`<h3>댓글을 달아주세요...</h3>`)
      return
    }
    res.status(200).json({comments})
  } catch (error) {
    res.status(400).json(error)
  }
})

// 댓글 수정하기
router.put('/posts/comments/:commentId',  authMiddleware, async (req, res) => {
  try {
    // 로그인한 사용자의 ID
    const user = res.locals.user
    // 파라미터로 댓글의 id와 body로 새 댓글내용 댓글의 패스워드를 가져온다.
    const commentId = req.params.commentId
    const { newContent } = req.body
    const comment = await Comments.findOne({_id: commentId})

    if(newContent.replace(/\s| /gi, "").length == 0) {
      // 댓글의 새내용이 공백이면 아래의 에러메세지를 반환
      res.status(400).json({errMsg : "댓글 내용을 입력해주세요"})
    }

    // 다른사용자의 댓글수정을 방지
    if(comment.userId != user._id) {
      // 댓글글작성자가 아니면 아래의 에러메세지 출력
      res.status(400).json({"errMsg" : "다른 사용자의 댓글은 수정할 수 없습니다."})
      return
    }
    await Comments.updateOne({_id: commentId}, {$set: {content: newContent}})
    res.status(200).json("댓글이 수정되었습니다.")
  } catch (error) {
    res.status(400).json(error)
  }
})

// 댓글 삭제
router.delete('/posts/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    // 로그인한 사용자의 ID
    const user = res.locals.user
    const commentId = req.params.commentId
    const comment = await Comments.findOne({_id: commentId})

    // 다른사용자의 댓글수정을 방지
    if(comment.userId != user._id) {
      // 댓글글작성자가 아니면 아래의 에러메세지 출력
      res.status(400).json({"errMsg" : "다른 사용자의 댓글은 수정할 수 없습니다."})
      return
    }
    await Comments.deleteOne({_id: commentId})
    res.status(200).send("댓글이 삭제되었습니다.")

  } catch (error) {
    res.status(400).json(error)
  }
})


module.exports = router
