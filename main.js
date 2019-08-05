var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var testFolder = './data/';

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;
    var temp = ``;
    console.log("pathname : "+pathname);
    
    if(pathname === '/'){
        console.log("/");
        if(queryData.id === undefined){
            
            var files = fs.readdirSync(testFolder);    
            var title = 'welcome';
            var description = 'welcome to web';
            var fileList = madeLiTag(files)
            
            temp = innerHTML(title, description, fileList,
                             `<a href="/create">create</a>`);

        }else{
            
            var files = fs.readdirSync(testFolder);
            var title = queryData.id;
            var readFiles = files;
            var fileList = madeLiTag(files);

            var description = fs.readFileSync(`data/${queryData.id}`, 'utf8')
                
            temp = innerHTML(title, description, fileList,
                             `<a href="/create">create</a>
                              <a href="/update">update</a>`);
            
            
        }
        
        
        response.writeHead(200);
        response.end(temp);
         
    }else if(pathname === "/create"){
        console.log(pathname);
        var files = fs.readdirSync(testFolder);
        var title = 'welcome';
        var fileList = madeLiTag(files)
        var description = `
            <form action="http://localhost:3000/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
            <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            <input type="submit">
            </p>
        </form>
        `;

        temp = innerHTML(title, description, fileList, '');

        response.writeHead(200);
        response.end(temp);
    }else if(pathname === "/create"){
        console.log(pathname);
        var files = fs.readdirSync(testFolder);
        var title = 'welcome';
        var fileList = madeLiTag(files)
        var description = `
            <form action="http://localhost:3000/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
            <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            <input type="submit">
            </p>
        </form>
        `;

        temp = innerHTML(title, description, fileList, '');

        response.writeHead(200);
        response.end(temp);
    }else if(pathname === "/update"){

        response.writeHead(200);
        response.end('success');
        
    }else{
        console.log("else");
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);

function madeLiTag(readFiles){
    var fileList = `
    `;
    for(var i=0;i<readFiles.length;i++){
        fileList += `<li><a href="/?id=${readFiles[i]}">${readFiles[i]}</a></li>`
    }
    
    return fileList;
}

function innerHTML(title, description, fileList, control){
    return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
        ${fileList}
        </ul>
        ${control}
        <h2>${title}</h2>
        <p>
        ${description}
        </p>
        </body>
        </html>
    `;
    
}