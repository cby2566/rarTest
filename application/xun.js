const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');
const fileTo = require('./ftlToRAR')

let originUrl = "G:\\菊姬plus\\ftl\\01-13\\[かるま龍狼]"
let putUrl = "G:\\outx\\application\\dirname.rbq"

console.log(path.parse(originUrl))
console.log(path.join(originUrl))
//从菊姬plus开始

//循环递归文件夹
async function acc(url){
    
    let arr = []
    let i = await fileTo.readAllFileName2(fsPromise,url,true,arr)
    console.log(i)
    console.log(123)
    console.log(arr)
    // console.log(fsPromise.createWriteStream) //抛出异常
    // let fsStreamWrite = fs.createWriteStream(putUrl)
    // for(let j of arr){
    //     fsStreamWrite.write(`${j}`+'\n')
    // }
    // fsStreamWrite.end()
}
acc(originUrl)