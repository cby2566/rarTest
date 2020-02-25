const fs = require("fs");
// var path = 'G://菊姬zip'

// 导出
module.exports = '99989'
module.exports = {
    //封装重命名函数
    fileModify(fsp,dirName){
        let psArr = []
        let p = fsp.readdir(dirName)
        .then((files)=>{
            files.forEach((filename)=>{
                let oldPath = dirName + '/' + filename;
                let newPath = dirName + '/' + filename.replace(/.ftc/g, '.rar');
                psArr.push(fsp.rename(oldPath,newPath))
            })
            return Promise.all(psArr)
        }).then(()=>{
            console.log('重命名完成')
            return fsp.readdir(dirName)
        })
        return p
    }
}
function text(){
    //参考答案
    let url = 'G://菊姬plus/ftl/01-18'
let passWord = 'mayuyu123'
// fileTo.fileModify(fsPromise,url).then((data)=>{
//     console.log(data)
//     // for(let item of data){
        
//     // }
//     let item = data[1]
//     let outUrl = `${url}/${item.replace('.rar','')}/`
//         let rarUrl = `${url}/${item}`
//         unRAR(rarUrl,outUrl)
// })


function execCmd(cmdStr,next){
    exec(cmdStr,function(err,stdout,stderr){
        console.log('运行完成')
    });
}
function unRAR(url,outUrl) {
    // let dataPass = `start winrar e -y -p${passWord} ${url} ${outUrl}`
    let dataPass = `start winrar x -y -p${passWord} ${url} ${outUrl}`
    execCmd(dataPass)
}

const { spawn,exec  } = require('child_process');
// const ls = spawn('start',['rar']);
exec('rar x -pmayuyu123 ./la.rar -y  ',{encoding:'uft8'}, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行的错误: ${error}`);
      return;
    }
    console.log(`stdout: ${iconv.decode(stdout,'gb2312')}`);
    // console.error(`stderr: ${stderr}`);
  });
  //vs控制台乱码解决 chcp 65001
// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
  
//   ls.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });
//   ls.on('close', (code) => {
//     console.log(`子进程退出，退出码 ${code}`);
//   });
//   ls.on('error', (code) => {
//     console.log(`报错 ${code}`);
//   });
}