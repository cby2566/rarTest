const fs = require('fs');


// fs.promises.opendir('./').then((data)=>{
//   console.log(data)
// })
function text1(){
  //打开当前目录获取文件名
  fs.opendir('./',(err,dir)=>{
  
    // console.log(dir.read())
    //console.log(dir[Symbol.asyncIterator]())
    let iter = dir[Symbol.asyncIterator]();
    console.log(iter)
    fn()
    async function fn(){
      for await(let x of iter){
        console.log(x)
        console.log(x.name)
      }
    }
  })
}

function text2(){
  //打开目录（指定编码和缓冲条目），返回Dir
  //返回fs.dir，代表目录流的类
  fs.opendir('./',{encoding:'utf8',bufferSize:32},function(err,dir){
    console.log(dir)
    let iter = dir[Symbol.asyncIterator]();
    console.log(iter)
    fn()
    async function fn(){
      for await(let x of iter){
        console.log(x.name)
        console.log(x.isDirectory())
        console.log(x.isFile())
      }
    }
  })
}
// fs.open('./过滤','r','0o666',(err,fd))
function text3(){
  //通过文件描述符fd来打开文件'
  fs.open('./过滤','r',(err,fd)=>{
    console.log(fd)
    //会缓冲整个文件
    fs.readFile(fd,{encoding:'utf8',flag:'r'},(err,data)=>{
      //如encoding为null，则data为buffer  <Buffer 23 20 e
      console.log(data)
    })
  })
}
function text4(){
  //undefined ???
  fs.readlink('./',{encoding:'utf8'},(err,linkStrin)=>{
    console.log(linkStrin)
  })
}
// fs.rename(oldPath,newPath,(err) => {
//   if(err) throw err;
//   console.log('rename')
// })
//重命名
function text5(){
  fs.rename('./过滤2','./过滤',(err) => {
    if(err) throw err;
    console.log('rename')
  })
}
//写入
// fs.write
//可读 可写 流
function text6(){
  //如果要接着写 createWriteStream的几个参数是关键
  let fsStreamWrite = fs.createWriteStream('rbq.rbq')
  fsStreamWrite.write('777')
  fsStreamWrite.write('888 \n')
  fsStreamWrite.end('999')
}

//let fsSreamRead = fs.createReadStream('rbq.rbq');
// console.log(fsSreamRead)

//逐行读写要单独安装模块

//另，读取文件名
// let fileName = fs.readdirSync('./',{withFileTypes:true})
// fs.readdir('./',{withFileTypes:true},(err,files)=>{
//   console.log(files)

// })'
function text7(){
  let arr = []
  function rName(url){
      fs.readdir(url,{withFileTypes:true},(err,files)=>{
        for(let item of files){
          if(item.isDirectory()){
            if(item.name == '.git') continue;
            // console.log(item.name,1)
            arr.push(item.name+'-')
            rName(`${url}/${item.name}`)
          }else{
            // console.log(item.name,2)
            arr.push(item.name)
          }
        }
      })
  
  }
  rName('./')
  setTimeout(()=>{
    console.log(arr)
  },1000)
}

//async改写定时器
function text8(){
  function timeOut(ms){
    return new Promise((resolve)=>{
      setTimeout(()=>{
        console.log(ms)
        resolve();
      },ms)
    })
  }
  async function point(data,ms){
    for(let i =0;i<3;i++){
      await timeOut(ms+i);
      console.log('循环中',i)
    }
    console.log(data)
    // return 'holl'
  }
  point(88888,1000)
}

// let arr = []
function text9(){
  //想自己写，用promise递归，显示出树状结果图，失败了
  function rName(url){
    return new Promise((resolve)=>{
      fs.readdir(url,{withFileTypes:true},(err,files)=>{
        resolve();
        callback(files,url)
      })
    })
  }
  
  function callback(files,url){
    for(let item of files){
      if(item.isDirectory()){
        if(item.name == '.git') continue;
        console.log(item.name,1)
        // arr.push(item.name+'-')
        rName(`${url}/${item.name}`)
      }else{
        console.log(item.name,2)
        // arr.push(item.name)
      }
    }
  }
    
  let pk = new Promise((resolve)=>{})
  async function play(){
    console.log('start')
    await rName('./');
    console.log('end')
  }
  play()
}

