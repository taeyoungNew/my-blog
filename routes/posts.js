const express = require('express')
const router = express.Router()
const Posts = require("../schemas/posts")
const Comments = require("../schemas/comments")
const getDate = require("../modules/date")
const authMiddleware = require("../middleware/auth-middleware")


// 모든 게시물 조회
router.get('/posts', async (req, res) => {
  try {
    const allPosts = await Posts.find({}, {"password": false, "content": false, "_id": false, "userId": false})
    console.log("allPosts = ", allPosts)
    if(allPosts.length === 0) res.send("게시물을 달아주세요...")
    const result = allPosts.sort((a, b) => {
      return Number(b.writeDate.replace(/\-|:|\s/g, "",)) - Number(a.writeDate.replace(/\-|:|\s/g, ""))
    })
    console.log("result = ", result)
    res.status(200).json({"allPosts": result})
  } catch (error) {
    res.send(error)
  }
})

// 게시물등록하기
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user
    let newPost = req.body
    console.log("userId = ",userId.nickname)
  
    newPost.userId = userId._id 
    newPost.nickname = userId.nickname
    newPost.writeDate = getDate()
    await Posts.create({
      userId : newPost.userId, 
      nickname : newPost.nickname,
      postTitle : newPost.postTitle,
      content : newPost.content,
      writeDate : newPost.writeDate

    })
    return res.status(200).json(`게시물 등록완료`)
    
  } catch (error) {
    return res.status(400).json(error)
  }
})

// 게시물 상세조회
router.get('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId
    const results = await Posts.find({_id: postId}, {password: false, _id: false, userId: false})
    res.status(200).json({results})
  } catch (error) {
    res.status(400).json("해당 게시물을 찾을 수 없습니다.")
  }
})


// 선택한 게시물 수정하기
router.put('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    // 수정한 내용을 아래 상수에 담기
    const { newContent } = req.body
    // 게시글을 작성한 사용자인지 검증
    const userId = res.locals.user
    const postId = req.params.postId
    let post = await Posts.findOne({_id:postId})
    console.log(post)
    console.log(userId);
    if(!userId._id.equals(post.userId)) {
      // 게시글작성자가 아니면 아래의 에러메세지 출력
      res.status(400).json({"errMsg" : "다른 사용자의 게시글은 수정할 수 없습니다."})
      return
    }

    await Posts.updateOne({_id: postId}, {$set: {content: newContent}})
    return res.status(200).json("수정했습니다.")
    
  } catch (error) {
    return res.status(400).json(error)
  }
})


// 게시물 삭제하기
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    console.log("게시글 작세하기")
    // 게시글을 작성한 사용자인지 검증
    const userId = res.locals.user
    const postId = req.params.postId
    
    const findPost = await Posts.findOne({ _id: postId })

    if(!userId._id.equals(findPost.userId)) {
      // 게시글작성자가 아니면 아래의 에러메세지 출력
      res.status(400).json({"errMsg" : "다른 사용자의 게시글은 삭제할 수 없습니다."})
      return
    }

    // 받아온 postId로 해당게시물이 데이터베이스에 있는지 확인하기
    console.log('findPost =', findPost)
    // 있다면 
    if(findPost !== null) {
      // 해당게시글에 달린 댓글들 찾기
      const postComments = await Comments.find({postId : postId})
      if(postComments.length > 0) {
        // 해당게시물의 댓글지우기
        postComments.forEach(async (x) => {
          console.log(x)
          if(x.postId === postId) {
            await Comments.deleteOne({postId: postId})
          }
        })

      }
      
      // 해당 게시물의 _id값과 같은 게시물을 삭제
      await Posts.deleteOne({ _id: postId})
      res.status(200).json({success:true})
    } else if(findPost === null) {
      // 없다면 아래의 실패메세지를 전달
      res.status(404).json({
        success: false,
        errMsg: "해당게시물이 없습니다."
      })
    }
    
  } catch (error) {
    res.status(400).json(error)
  }
})


module.exports = router