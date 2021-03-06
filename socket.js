const SocketIO = require('socket.io')
const axios =  require('axios')

module.exports = (server, app, sessionMiddleware) => {
    const io =  SocketIO(server, {path: '/socket.io'})
    app.set('io', io)

    const room = io.of('/room')
    const chat = io.of('/chat')

    // 미들웨아는 아래와 같이 사용하자. 책에 있는데로 하면 에러난다
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
    chat.use(wrap(sessionMiddleware))

    room.on('connection', (socket)=>{
        console.log('===== room 네임스페이스 접속 =====')
        socket.on('disconnect', ()=>{
            console.log('===== room 네임스페이스 접속 해제 =====')
        })
    })

    chat.on('connection', (socket)=>{
        console.log('===== chat 네임스페이스 접속 =====')
        const req =  socket.request
        const {headers: {referer}} = req
        // roomId 추출
        const roomId = referer.split('/')[referer.split('/').length -1].replace(/\?.+/, '')

        socket.join(roomId)
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`
        })

        socket.on('disconnect', ()=>{
            console.log('===== chat 네임스페이스 접속 해제 =====')
            socket.leave(roomId)

            const currentRoom = socket.adapter.rooms.get(roomId)
            const userCount = currentRoom ? currentRoom.size : 0
            if(userCount === 0){
                // 방 제거 요청
                // 구지 axios를 써야할까? 그냥 모델 불러와서 삭제하면 안되나?
                axios.delete(`http://localhost:8003/room/${roomId}`)
                    .then(()=>console.log('제거 성공'))
                    .catch((error)=>{
                        console.error(error)
                    })
            }else{
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다`
                })
            }
        })
    })
}