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
                <a href="/create" class="create btn btn-primary">글쓰기</a>
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

//   <a class="nav-link" href="#"><li class="nav-item">질문 게시판</li></a>
    list: (filelist) => {
        let list = '<ul class="navbar-nav">';
        for(let i=0; i<filelist.length; i++){
            list += `<a class="nav-link" href="/board/${filelist[i].boardEN}"><li class="nav-item">${filelist[i].board}</li></a>`
        }
        list+="</ul>";
        return list;
    },

    mainContent: (filelist) =>{
        let content = `<div class="list-box d-flex">`

        for(let i=0; i<filelist.length; i++){
            console.log(filelist[i].boardEN);
            content += `<div class="list-group"><a href="/board/${filelist[i].boardEN}" class="more">더 보기</a></div>`
        }
        content += `</div>`;
        return content;
    },
 
    postContent: ()=>{
        return `
        <div class="list-box d-flex">
            <div class="boardName">자유게시판</div>
            <div class="postBox">
                <div class="post d-flex">
                    <a href="#" class="title">안녕하세요</a>
                    <span class="writer">익명</span>
                    <span class="date">2021-03-09 14:25</span>
                </div>
            </div>
        </div>`
    },
            // <div class="list-box d-flex">
            //     <div class="postBox">
            //         <div class="post d-flex">
            //             <a href="#" class="title">안녕하세요</a>
            //             <span class="writer">익명</span>
            //             <span class="date">2021-03-09 14:25</span>
            //         </div>
            //     </div>
            // </div>
  };
