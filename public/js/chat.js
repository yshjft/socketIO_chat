const socket = io.connect('http://localhost:8003/chat', {
    path: '/socket.io'
})

socket.on('join', (data)=>{
    let div = document.createElement('div')
    div.classList.add('system')
    let chat = document.createElement('div')
    div.textContent = data.chat
    div.appendChild(chat)
    document.querySelector('#chat-list').appendChild(div)
})

socket.on('exit', (data)=>{
    let div = document.createElement('div')
    div.classList.add('system')
    let chat = document.createElement('div')
    div.textContent = data.chat
    div.appendChild(chat)
    document.querySelector('#chat-list').appendChild(div)
})

socket.on('chat', (data)=>{
    let div = documnet.createElement('div')
    
    if(data.user  === '#{user}'){
        div.classList.add('mine')
    }else{
        div.classList.add('other')
    }
    let name = document.createElement('div')
    name.textContent = data.user
    div.appendChild(name)

    let chat = document.createElement('div')
    chat.textContent = data.chat
    div.appendChild(chat)

    div.style.color =  data.user
    document.querySelectorAll('#chat-list'),appendChild(div)
})

document.querySelector('#chat-form').addEventListener('submit', function(e){
    e.preventDefault()
    if(e.target.chat.value){
        let xhr =  new XMLHttpRequest()
        xhr.onload =  function(){
            if(xhr.status === 200){
                e.target.current.value = ''
            }else{
                console.error(xhr.responseText)
            }
        }
        xhr.open('POST', '/room/#{room.id}/chat')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({chat: this.chat.value}))
    }
})