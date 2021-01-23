document.querySelectorAll('#enter').forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        if(e.target.dataset.password === 'true'){
            const password = prompt('비밀번호 입력')
            location.href = '/room/' + e.target.dataset.id + '?password=' + password
        }else{
            location.href = '/room/' + e.target.dataset.id 
        }
    })
})