const express = require('express')
const router =  express.Router()
const {Room, Chat} = require('../models')

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
        const io = req.app.get('io')
        io.of('/room').emit('newRoom', newRoom.dataValues)
        res.redirect(`/room/${newRoom.id}/?password=${req.body.password}`)
    }catch(error){
        console.error(error)
        rnext(error)
    }
})

router.get('/room/:id', async(req, res, next)=>{
    try{
        const room = await Room.findOne({where: {id: req.params.id}})
        const io = req.app.get('io')
        if(!room) return res.redirect('/')
        
        if(room.password && room.password !== req.query.password){
            return res.redirect('/')
        }

        // 방 목록 가지고 오기
        const {rooms} = io.of('/chat').adapter
        // io.of('/chat').adapter.rooms[req.params.id] : 방의 소켓 목록을 확인할 수 있다고 한다.
        if(rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length){
            return res.redirect('/')
        }

        const chats =  await Chat.findAll({where: {room:  room.id}})
        return res.render('chat', {
            title: TITLE,
            room,
            chats,
            user: req.session.color
        })
    }catch(error){
        console.error(error)
        next(error)
    }
})

router.post('/room/:id/chat', async(req, res, next)=>{
    const {chat} =  req.body

    console.log(chat)
    res.end()
})


module.exports = router