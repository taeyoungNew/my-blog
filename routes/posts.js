const express = require('express')
const router = express.Router()
const Posts = require("../schemas/posts")
const Comments = require("../schemas/comments")
const mongoose = require("mongoose")
const getDate = require("../modules/date")
// const {ObjectId} = mongoose.Types
// const ObjectId = require('mongodb').ObjectId

// 모든 게시물 조회
router.get('/posts', async (req, res) => {
  try {
    console.log("?????")
    const allPosts = await Posts.find({}, {"password": false, "content": false})
    if(allPosts.length === 0) res.send("게시물을 달아주세요...")
    const result = allPosts.sort((a, b) => {
      return Number(b.writeDate.replace(/\-|:|\s/g, "",)) - Number(a.writeDate.replace(/\-|:|\s/g, ""))
    })
    res.status(200).json({"allPosts":allPosts})
  } catch (error) {
    res.send(error)
  }
})

// 게시물등록하기
router.post('/posts', async (req, res) => {
  try {
    const passwordRex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const newPost = req.body
    newPost.writeDate = getDate()
    console.log('newPost =', newPost)
    if(passwordRex.test(newPost.password) !== true) {
      res.status(400).send("비밀번호는 최소 8 자, 최소 하나의 문자 및 하나의 숫자로 입력해주세요")
      return 
    } else {
      await Posts.create(newPost)
      res.status(201).json({mds : "게시물 등록완료"})

    }
  } catch (error) {
    res.status(400).json(error)
  }
})

// 선택한 게시물 검색하기
router.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId
    const results = await Posts.find({_id: postId}, {password: false})
    res.status(200).json({results})
  } catch (error) {
    res.status(400).json("해당 게시물을 찾을 수 없습니다.")
  }
})


// 선택한 게시물 수정하기
router.put('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId
    const { newContent, password } = req.body
    
    let post = await Posts.findOne({_id:postId})
    const passwordPass = post.password === password ? true : false
    
    if(passwordPass) {
      await Posts.updateOne({_id: postId}, {$set: {content: newContent}})
      res.status(200).json("수정했습니다.")
    } else {
      res.status(400).json("password가 틀렸습니다.")
    }
    
  } catch (error) {
    res.status(400).json("해당 게시물을 찾을 수 없습니다.")
  }
})


// 게시물 삭제하기
router.delete('/posts/', async (req, res) => {
  try {
    const { postId, password } = req.body
    console.log(postId, password);
    // 받아온 postId로 해당게시물이 데이터베이스에 있는지 확인하기
    const findPost = await Posts.findOne({ _id: postId })
    // 있다면 
    if(findPost !== null) {
      if(findPost.password !== password) {
        res.status(404).json({
          success: false,
          errMsg: "password가 틀렸습니다."
        })
        return 
      }
      
      const postComments = await Comments.find({postId : postId})
      // console.log('postComments', postComments);
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