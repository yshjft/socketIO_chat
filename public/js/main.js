const socket = io.connect('http://localhost:8003/rooom', {
    path:'/soket.io'
})

// socket.on('newRoom', (data)=>{
//     let tr =  document.createElement('tr')
    
//     let td =  document.createElement('td')
//     td.textContent =  data.title
//     tr.appendChild(td)

//     td = document.createElement('td')
//     td.textContent = data.password ? '비밀방' : '공개방'
//     tr.appendChild(td)

//     td = document.createElement('td')
//     td.textContent = data.max
//     tr.appendChild(td)

//     td = document.createElement('td')
//     td.style.color =  data.owner
//     td.textContent = data.owner
//     tr.appendChild(td)

//     td = document.createElement('td')
//     let button =  document.createElement('button')
//     button.textContent =  '입장'
//     button.dataset.password =  data.password ? 'true' : 'false'
//     button.dataset.id = data._id
//     button.addEventListener('click', addBtnEvent)
//     td.appendChild(button)
//     tr.appendChild(td)
    
//     tr.dataset.id = data._id
//     document.querySelector('table tbody').appendChild(tr)
// })

function addBtnEvent(e){
    console.log(123)
    if(e.target.dataset.password === 'true'){
        const password = prompt('비밀번호 입력')
        location.href = '/room/' + e.target.dataset.id + '?password=' + password
    }else{
        location.href = '/room/' + e.target.dataset.id 
    }
}

document.querySelectorAll('#enter').forEach((btn)=>{
    btn.addEventListener('click', addBtnEvent)
})