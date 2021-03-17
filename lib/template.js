module.exports = {
  HTML: (category, content, css) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="/css/bootstrap.min.css">
        <link rel="stylesheet" href="/css/base.css">
        <link rel="stylesheet" href="${css}">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="loginBack">
            <form action="/processLogin" class="loginPage" method="post">
                <button class="loginClose" type="button">X</button>
                <div class="form-group d-flex">
                    <label for="formGroupExampleInput">아이디</label>
                    <input name="id" type="text" class="form-control" id="formGroupExampleInput">
                </div>
                <div class="form-group d-flex">
                    <label for="formGroupExampleInput">비밀번호</label>
                    <input name="password" type="text" class="form-control" id="formGroupExampleInput">
                </div>
                <button class="btn btn-primary loginSubmit" type="submit">로그인</button>
                <a href="/register" class="btn btn-primary registerSubmit">회원가입</a>
            </form>
        </div>
        <nav class="navbar navbar-expand-none">
            <a href="/" class="navbar-brand">DevCom</a>
            <div class="rightNav">
                <button class="login">login</button>
                <a href="./register" class="register">register</a>
                <button class="navbar-toggler navbar-dark type="button" data-toggle = "collapse" data-target="#main-navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse" id="main-navigation">
                ${category}
            </div>
        </nav>
    
    
        <div class="container-fluid contents d-flex">
            <div class="left">
            </div>
            <div class="right">
                ${content}
            </div>
        </div>
    
        <div class="footer">
        </div>
    
        <script src="/js/main.js"></script>
        <script src="/js/jquery.min.js"></script>
        <script src="/js/bootstrap.min.js"></script>
    </body>
    </html>
        `;
},

list: (fileList) => {
    let list = '<ul class="navbar-nav">';
    for(let i=0; i<fileList.length; i++){
        list += `
        <a class="nav-link" href="/board/${fileList[i].boardEN}/1">
            <li class="nav-item">${fileList[i].board}</li>
        </a>`
    }
    list+="</ul>";
    return list;
},

mainContent: (board, postList) =>{
    let content = `<div class="list-box d-flex">`

    for(let i=0; i<board.length; i++){
        let cnt=0;

        content += `
        <div class="list-group">
        <a href="/board/${board[i].boardEN}/1" class="more">${board[i].board}/ 더 보기</a>
        `
        
        
        for(let j=0; j<postList.length; j++){
            const offset = new Date().getTimezoneOffset() * 60000;
            let today = new Date(postList[j].date - offset);
            let now = new Date(today).toISOString().slice(0, 19).replace('T', ' ');

            if(postList[j].board == board[i].boardEN){
                if(cnt == 7) break;
                content += `
                <div class="post d-flex">
                    <a href="/board/${postList[j].board}/description/${postList[j].id}" class="title">${postList[j].title}</a>
                    <span class="writer">${postList[j].writer}</span>
                    <span class="date">${now}</span>
                </div> 
                `
                cnt++;
            }
        }    
        content += `</div>`
    }
    content += `</div>`;
    return content;
},

postContent: (boardName, postList, postCount)=>{
    let pageNumContent =`<div class="pageCount d-flex">`;
    for(let i=0; i <= (postCount-1) / 20; i++){
        pageNumContent += `
        <a href="/board/${boardName}/${i+1}">${i+1}</a>
        `
    }
    pageNumContent+=`</div>`;

    let list = `
    <div class="list-box d-flex">
    <div class="boardName">${boardName}</div>
    <div class="postBox">`
    for(let i=0; i<postList.length; i++){
        const offset = new Date().getTimezoneOffset() * 60000;
        const today = new Date(postList[i].date - offset);
        let now = new Date(today).toISOString().slice(0, 19).replace('T', ' ');
        list+=`
        <div class="post d-flex">
                <a href="/board/${boardName}/description/${postList[i].id}" class="title">${postList[i].title}</a>
                <span class="writer">${postList[i].writer}</span>
                <span class="date">${now}</span>
        </div>`
    }
    list += `
    </div>
    ${pageNumContent}
    </div>
    <a href="/create/${boardName}" class="create btn btn-primary">글쓰기</a>
    </div>`

    return  list;
},

createContent: (boardName) =>{
    return `
    <form action="/processCreate/${boardName}" class="form-group name="postInfo" method="post">
            <input class="form-control" type="text" placeholder="title" name="title">
            <textarea name="description" class="form-control" id="exampleFormControlTextarea1" rows="13" placeholder="description"></textarea>
            <button type="submit" class="btn btn-primary mb-2">올리기</button>
    </form>`
},

postDescriptionContent: (post) =>{
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(post[0].date - offset);
    let now = new Date(today).toISOString().slice(0, 19).replace('T', ' ');
    return `
    <div class="list-box d-flex">
        <div class="postContentBox d-flex">
            <div class="title">${post[0].title}</div>
            <div class="writer">${post[0].writer}</div>
            <div class="date">${now}</div>
            <div class="description">${post[0].description}</div>
        </div>
        <div class="buttons d-flex">
            <a href="/update/${post[0].id}" type="button" class="btn btn-lg btn-outline-success">수정</a>
            <form action="/processDelete" method="post">
                <input type="hidden" name="id", value="${post[0].id}">
                <input type="hidden" name="boardName", value="${post[0].board}">
                <button type="submit" class="btn btn-lg btn-outline-success">삭제</button>
            </form>
        </div>
    </div>
    `
},

getDate: ()=>{
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset);

    return new Date(today).toISOString().slice(0, 19).replace('T', ' ');
},

updateContent:(content) =>{
    return`
    <form action="http://localhost:3001/processUpdate/${content.board}/${content.id}" class="form-group name="postInfo" method="post">
            <input class="form-control" type="text" placeholder="title" name="title" value="${content.title}">
            <textarea name="description" class="form-control" id="exampleFormControlTextarea1" rows="13" placeholder="description">${content.description}</textarea>
            <button type="submit" class="btn btn-primary mb-2">수정하기</button>
    </form>`
},

registerContent:() =>{
    return `
    <div class="list-box">
      <form class="registerForm" action="/processRegister" method="post">
        <div class="form-group d-flex">
          <label for="formGroupExampleInput">아이디</label>
          <input name="id" type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input">
        </div>
        <div class="form-group d-flex">
          <label for="formGroupExampleInput2">비밀번호</label>
          <input name="password" type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input">
        </div>
        <div class="form-group d-flex">
          <label for="formGroupExampleInput2">비밀번호 확인</label>
          <input name="checkPassword" type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input">
        </div>
        <div class="form-group d-flex">
            <label for="formGroupExampleInput2">이메일</label>
            <input name="email" type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input">
        </div>
        <div class="form-group d-flex">
            <label for="formGroupExampleInput2">닉네임</label>
            <input name="name" type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input">
        </div>
        <button type="submit" class="registerSubmitBtn">등록</button>
      </form>
    </div>
    `
},

checkEmail:(str)=>
{                                                 
     var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
     if(!reg_email.test(str)) {                            
          return false;         
     }                            
     else {                       
          return true;         
     }                            
}       
};
