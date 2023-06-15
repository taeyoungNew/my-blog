const express = require('express')
const router = express.Router()
const Posts = require("../schemas/posts")
const Comments = require("../schemas/comments")
const getDate = require("../modules/date")

// 댓글 달기
router.post('/posts/comments', async (req, res) => {
  try {
    const passwordRex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const newComment = req.body
    newComment.writeDate = getDate()
    // console.log('newComment = ', newComment)

    const check = await Posts.findOne({_id: newComment.postId})
    // console.log(check)
    // 만약 댓글을 달고자 한느 게시글이 없으면 아래의 에러를 반환 
    if(check === null) {
      res.status(400).json({errMsg : "해당 게시글이 없습니다."})
      return
    }
    // 댓글 내용이 비어있으면 아래의 에러를 반환
    if(newComment.content.replace(/\s| /gi, "").length == 0) {
      res.status(400).json({errMsg : "댓글 내용을 입력해주세요"})
      return
    } 
    // // 비밀번호 정규식이 틀리면 아래의 에러를 반환
    if(passwordRex.test(newComment.commentPassword !== false)) {
      res.status(400).send("비밀번호는 최소 8 자, 최소 하나의 문자 및 하나의 숫자로 입력해주세요")
      return 
    }

    const reuslt = await Comments.create(newComment)
    // console.log(reuslt)
    res.status(201).json({"댓글작성완료": reuslt})
    
  } catch (error) {
    res.status(400).json(error)
  }
})

// 댓글 조회하기 게시글의 id를 parammeter로 받고 해당되는 댓글의 목록을 가져온다.
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    // 게시글의 id값을 받는다.
    const postId = req.params.postId
    // 게시글의 id값을 가지고 있는 댓글을 모두 가져온다.
    const comments = await Comments.find({postId : postId})
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
router.put('/posts/comments/:commentId', async (req, res) => {
  try {
    // 파라미터로 댓글의 id와 body로 새 댓글내용 댓글의 패스워드를 가져온다.
    const commentId = req.params.commentId
    const { newContent, password } = req.body
    const comment = await Comments.findOne({_id: commentId})
    
    console.log("payload = ", comment, newContent, password)
    if(newContent.replace(/\s| /gi, "").length == 0) {
      // 댓글의 새내용이 공백이면 아래의 에러메세지를 반환
      res.status(400).json({errMsg : "댓글 내용을 입력해주세요"})
    } else {
      // 댓글의 패스워드와 입력한 패스워드를 비교
      if(comment.password === password) {
        // 일치하면 댓글의 내용을 수정
        await Comments.updateOne({_id: commentId}, {$set: {content: newContent}})
        res.status(200).send("댓글이 수정되었습니다.")
      } else {
        // 일치하지 않으면 아래의 에러메세지를 반환 
        res.status(400).send("비밀번호가 틀립니다.")
      }
    }
  } catch (error) {
    res.status(400).json(error)
  }
})

// 댓글 삭제
router.delete('/posts/comments/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId
    const comment = await Comments.findOne({_id: commentId})
    const { password } = req.body
    console.log(commentId, comment);
    if(comment.password === password) {
      await Comments.deleteOne({_id: commentId})
      res.status(200).send("댓글이 삭제되었습니다.")
    } else {
      res.status(400).send("비밀번호가 틀립니다.")
    }

  } catch (error) {
    res.status(400).json(error)
  }
})


module.exports = router
