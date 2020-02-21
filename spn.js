const http = require('http')

http.createServer(function(request,response){
    response.header("Access-Control-Allow-Origin","*")
    response.header("Access-Control-Allow-Headers","*")
    response.header("Access-Control-Allow-Methods","*")
    console.log(101)
    response.end('999')
}).listen(9500)