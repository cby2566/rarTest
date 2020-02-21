const zlib = require('zlib')
const fs = require('fs')

let inp = fs.createReadStream('./test.js')
let out = fs.createWriteStream('./test.js.zip')
let gzip = zlib.createGzip()

function text() {
    //简单压缩 可指定 gz zip
    inp.pipe(gzip).on('error',()=>{
        console.log('压缩错误1')
    }).pipe(out).on('error',()=>{
        console.log('压缩错误2')
    });
}
text()
//解压缩，好像只能buffer格式

//不解压 读取文件内容模块 AdmZip

//?child_process模块 解压密码