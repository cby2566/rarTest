const fs = require("fs");
// var path = 'G://菊姬zip'

// 导出
module.exports = '99989'
module.exports = {
    //封装重命名函数,重命名文件后缀
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
    },
    //写入文件函数
    mapWriteFile(fsp,fileName,mapArr){
        let fsStreamWrite = fsp.createWriteStream(fileName)
        if(Array.isArray(mapArr)){
            for(let i of mapArr){
                fsStreamWrite.write(`${i[0]} -> ${i[1]}`+'\n')
            }
        }else{
            for(let [k,v] of mapArr){
                fsStreamWrite.write(`${k} -> ${v}`+'\n')
                // console.log(k,v)
            }
        }
        fsStreamWrite.end()
    },
    //按文件名读取文件夹，返回promise
    readAllFileName(fsp,url,children){
        return fsp.readdir(url)
            .then((data)=>{
                if(children) data.push(children);
                return data;
            }).catch((err)=>{
                console.log('err:',err)
            })
    },
}
///////////////////
function text(){
    //参考答案
    let url = 'G://菊姬plus/ftl/01-15'
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