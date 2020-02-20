const fs = require('fs');


// fs.promises.opendir('./').then((data)=>{
//   console.log(data)
// })
fs.opendir('./',(err,dir)=>{
  
  // console.log(dir.read())
  //console.log(dir[Symbol.asyncIterator]())
  let iter = dir[Symbol.asyncIterator]();
  console.log(iter)
})
