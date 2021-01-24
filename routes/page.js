const express = require('express')
const router =  express.Router()
const {Room} = require('../models')

const TITLE =  '채팅방'

router.get('/', async(req, res, next) => {
    try{
        const rooms = await Room.findAll()
        res.render('main', {
            title: TITLE,
            rooms
        })
    }catch(error){
        console.error(error)
        next(error)
    }    
})

router.get('/room', (req, res, next)=>{
    res.render('room', {
        title: TITLE
    })
})

router.post('/room', async (req, res, next)=>{
    const {title, max, password} =  req.body
    try{
        const newRoom =  await Room.create({
            title,
            max,
            owner: req.session.color,
            password
        })

        console.log('newRoom  = ', newRoom.dataValue)
        const io = req.app.get('io')
        io.of('/room').emit('newRoom', newRoom)
        res.redirect(`/room/${newRoom._id}/?password=${req.body.password}`)
    }catch(error){
        console.error(error)
        rnext(error)
    }
})

router.get('/room/:id', (req, res, next)=>{
    res.render('chat', {
        title: TITLE
    })
})


module.exports = router