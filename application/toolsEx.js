const fs = require('fs');
const fsPromise = fs.promises;

const fileTo = require('./ftlToRAR')

let originUrl = 'G:/菊姬plus/ftl/01-19'

async function acc(){
    //读取文件夹中ftc的全部文件名
   let originDirArr = await fileTo.readAllFileName(fsPromise,originUrl)
   console.log(originDirArr)
   let m = await  fileTo.fileModify(fsPromise,originUrl)
   console.log(m)
}
acc()
