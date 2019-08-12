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
            var fileList = madeLiTag(files);

            var description = fs.readFileSync(`data/${queryData.id}`, 'utf8')
                
            temp = innerHTML(title, description, fileList,
                             `<a href="/create">create</a>
                              <a href="/update?id=${title}">update</a>
                              <form action="delete_proccess" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" value="delete">
                              </form>
                              `);
            
            
        }
        
        
        response.writeHead(200);
        response.end(temp);
         
    }else if(pathname === "/create"){
        console.log(pathname);
        var files = fs.readdirSync(testFolder);
        var title = 'WEB - create';
        var fileList = madeLiTag(files)
        var description = `
            <form action="http://localhost:3000/create_process" method="post">
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
    }else if(pathname === "/create_process"){
        var body = '';
        request.on('data', function(data){
            body += data;
        });

        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.write(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });

        })

        
    }else if(pathname === "/update"){

        var files = fs.readdirSync(testFolder);
        var title = queryData.id;
        var fileList = madeLiTag(files);
        var description = fs.readFileSync(`data/${queryData.id}`, 'utf8');
        var body = `
                    <form action="http://localhost:3000/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
        `;
        temp = innerHTML(title, body, fileList, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`)
        response.writeHead(200);
        response.end(temp);
        
    }else if(pathname === "/update_process"){

        var body = '';
        request.on('data', function(data){
            body += data;
        });

        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
        
    }else if(pathname === "/delete_process"){

        var body = '';
        request.on('data', function(data){
            body += data;
        });

        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data${id}`,function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            });
            
        });
        
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