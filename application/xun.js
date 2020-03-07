const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');
const fileTo = require('./ftlToRAR')

let originUrl = "D:\\marckor\\eramaouEX 0.92"
//循环递归文件夹
async function acc(url){
    let arr = []
    let i = await fileTo.readAllFileName2(fsPromise,url,true,arr)

    console.log(i)
    console.log(123)
    console.log(arr)
}
acc(originUrl)