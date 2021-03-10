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
    </head>
    <body>
        <nav class="navbar navbar-expand-none">
            <a href="/" class="navbar-brand">DevCom</a>
            <button class="navbar-toggler navbar-dark type="button" data-toggle = "collapse" data-target="#main-navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
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
        <a class="nav-link" href="/board/${fileList[i].boardEN}">
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
        <a href="/board/${board[i].boardEN}" class="more">${board[i].board}/ 더 보기</a>
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

postContent: (boardName, postList)=>{
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
    </div>
    <a href="/create/${boardName}" class="create btn btn-primary">글쓰기</a>
    </div>`

    return  list;
},

createContent: (boardName) =>{
    return `
    <form action="http://localhost:3001/processCreate/${boardName}" class="form-group name="postInfo" method="post">
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
    </div>
    `
},

getDate: ()=>{
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset);

    return new Date(today).toISOString().slice(0, 19).replace('T', ' ');
}
};
