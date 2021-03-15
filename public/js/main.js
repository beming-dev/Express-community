let loginBtn = document.getElementsByClassName("login")[0];
let registerBtn = document.getElementsByClassName("register")[0];
let loginBack = document.getElementsByClassName("loginBack")[0];

loginBtn.addEventListener('click', ()=>{
    if(loginBack.style.display == 'none')
        loginBack.style.display = 'flex';
    else loginBack.style.display = 'none';
});

