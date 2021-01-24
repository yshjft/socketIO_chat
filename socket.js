const SocketIO = require('socket.io')

module.exports = (server, app, sessionMiddleware) => {
    const io =  SocketIO(server, {path: '/socket.io'})
    app.set('io', io)

    const room = io.of('/room')
    const chat = io.of('/chat')

    //io.use를 통해 미들웨어 장착
    io.use((socket, next)=>{
        // 모든 웹 소켓 연결 시마다 실행
        sessionMiddleware(socket.request, socket.request.res, next)
    })

    room.on('connection', (socket)=>{
        console.log('connect to room namespace')
        socket.on('disconnect', ()=>{
            console.log('dosconnect to room namespace')
        })
    })

    chat.on('connection', (socket)=>{
        console.log('connect to chat namespace')
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
            console.log('chat 네임스페이스 접속 해제')
            socket.leave(roomId)
            const currentRoom = socket.adapter.rooms[roomId]
            const userCoumnt = currentRoom ? currentRoom.length : 0
            if(userCoumnt === 0){
                // 방 제거 요청
                // 구지 axios를 써야할까? 그냥 모델 불러와서 삭제하면 안되나?
                axios.delete('http://localhost:8005/room/${roomId}')
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