const express = require('express')
const router =  express.Router()
const {Room} = require('../models')

const TITLE =  '채팅방'

router.get('/', async(req, res, next) => {
    res.render('main', {
        title: TITLE
    })
})

router.get('/room', (req, res, next)=>{
    res.render('room', {
        title: TITLE
    })
})

router.post('/room', async (req, res, next)=>{
    const {title, max, password} =  req.body
    console.log(title, max, password)
    res.end()
})

router.get('/room/:id', (req, res, next)=>{
    res.render('chat', {
        title: TITLE
    })
})


module.exports = router