const http = require('http')
const fs = require('fs')
http.createServer(function(request,response){
    //设置响应头
    // response.writeHeadr(200,{
    //     'text/html':'html'
    // })
    let file = fs.readFileSync('./index.html')
    response.end(file)
}).listen(9000)