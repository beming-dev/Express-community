let password = document.getElementById("password");
let passwordCheck = document.getElementById("passwordCheck");
let match = document.getElementsByClassName("match")[0];

password.addEventListener('keyup', (e)=>{
    if(password.value == passwordCheck.value){
        match.classList.remove("pc");
    }else{
        match.classList.add("pc");
    }
});
passwordCheck.addEventListener('keyup', (e)=>{
    if(password.value == passwordCheck.value){
        match.classList.remove("pc");
    }else{
        match.classList.add("pc");
    }
})