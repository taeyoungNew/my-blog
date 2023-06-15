const express = require('express')
const router = express.Router()
const Posts = require("../schemas/posts")
const mongoose = require("mongoose")
const {ObjectId} = mongoose.Types
// const ObjectId = require('mongodb').ObjectId

// 모든 게시물 조회
router.get('/posts', async (req, res) => {
  try {
    const allPosts = await Posts.find({}, {"password": false, "content": false})
    console.log(allPosts)
    res.status(200).json({"allPosts":allPosts})
  } catch (error) {
    res.send("등록된 게시물이 없습니다.")
  }
})

// 게시물등록하기
router.post('/posts', async (req, res) => {
  try {
    const newPost = req.body
    const createPost = await Posts.create(newPost)
    res.status(200).json({createPost})
    
  } catch (error) {
    res.status(400).json({error})
  }
})

// 선택한 게시물 검색하기
router.get('/posts/:postTitle', async (req, res) => {
  try {
    const { postTitle } = req.params
    
    const results = await Posts.find({postTitle: postTitle}, {password: false})
    // console.log(results)
    res.status(200).json({results})
  } catch (error) {
    res.status(400).json("찾을 수 없습니다.")
  }
})


// 선택한 게시물 수정하기
router.put('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId
    const { newContent, password } = req.body
    console.log(postId, newContent, password)
    
    let post = await Posts.findOne({_id:postId})
    const passwordPass = post.password === password ? true : false
    
    if(passwordPass) {
      await Posts.updateOne({_id: postId}, {$set: {content: newContent}})
      res.status(200).json("수정했습니다.")
    } else {
      res.status(400).json("password가 틀렸습니다.")
    }
    // const checkPassword = post.map((x) => {
    //   if(x.password === password)
    // })
    // if(post.password === password) {
    //   console.log('비밀번호 맞음')
    //   console.log("게시물 조회하기", postData)
    // } else {
    //   res.status(401).json("입력하신 비밀번호가 틀립니다.")
    // }
    // const postData = await Posts.find({_id: postId}) 
    
  } catch (error) {
    res.status(400).json(error)
  }
})


// 게시물 삭제하기
router.delete('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId
    
    // 받아온 postId로 해당게시물이 데이터베이스에 있는지 확인하기
    const findPost = await Posts.findOne({ _id: postId })
    // 있다면 
    if(findPost !== null) {
      // 해당 게시물의 _id값과 같은 게시물을 삭제
      await Posts.deleteOne({ _id: postId})
      res.status(200).json({success:true})
    } else if(findPost === null) {
      // 없다면 아래의 실패메세지를 전달
      res.status(500).json({
        success: true,
        errMsg: "해당게시물이 없습니다."
      })
      // findPost = await Posts.findOne({ _id: ObjectId(postId) })
    }
    
  } catch (error) {
    res.status(400).json(error)
  }
})


module.exports = router