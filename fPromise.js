const fs = require('fs');

const fsPromise = fs.promises;

function text1(){
    //检查文件是否可访问，
    //不可在 open前使用 ，不太懂
    fsPromise.access('../菊姬zip/[かに家 (かにゃぴぃ)] /【下载自用可删除此txt文件】.txt',fs.constants.R_OK | fs.constants.W_OK)
    .then(()=>console.log('可以访问')).catch(()=>console.log('无法访问'))
}

function text2(){
    //读取目录下所有文件名，可以加withFileTypes。就多一个fs.Dirent对象
    fsPromise.readdir(
        '../菊姬zip'
        // ,{withFileTypes:true}
        ).then((data)=>{
        console.log(data)
    })
}
function text3(){
    //读取文本全部内容
    fsPromise.readFile('../菊姬zip/[かに家 (かにゃぴぃ)] /【下载自用可删除此txt文件】.txt'
    // ,{encoding:'utf8',flag:'r'}
    )
    .then((data)=>{
        // let buf = data.toString() 默认也是utf-8
        //gb2312 就要靠模块了
        console.log(data)
    })
}

function text3(){
    // fs.realpath('../菊姬zip',(err,link)=>{
    //     console.log(link)
    // })
    fsPromise.realpath('../菊姬zip').then((data)=>{
        console.log(data)
    })
}
function text4(){
    //删除，给recursive:true 则递归删除。但官网说不稳定
    //
    fsPromise.rmdir('../菊姬zip/[かに家 (かにゃぴぃ)] ',{recursive:true})
    .then(()=>console.log('ok')).catch((err)=>console.log('err',err))
}

    
