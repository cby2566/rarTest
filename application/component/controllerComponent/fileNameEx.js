
const fs = require('fs');
const fsPromise = fs.promises;
const iconv = require('iconv-lite')
// const fileTo = require('./ftlToRAR')


function readAllFileName(url){
    return fsPromise.readdir(url)
     .then((data)=>{
         // console.log(data)
         return data;
     }).catch((err)=>{
         console.log('err:',err)
     })
 }

module.exports ={
     texts(url){
        //用于解压飞猫网盘的那些链接，然后导出
        var arr7 = []
        return readAllFileName(url).then((data)=>{
            let txtArr = data.filter((item)=>{
                return item.includes('.txt')
            })
            let arr = []
            for(let i of txtArr){
                arr.push(fsPromise.readFile(url+'\\' + i))
            }
            arr7 = txtArr
            return Promise.all(arr)
        }).then((data)=>{
            let allReg = /链接：(.+)/g
            let allCloudUrl = []
            for(let i of data){
                let text = iconv.decode(i,'gb2312')
                allCloudUrl.push(text.match(allReg)) 
            }
            // console.log(allCloudUrl.length)
            // console.log(arr7,arr7.length)
            let newArr = []
            for(let i of allCloudUrl){
                for(let j of i){
                    newArr.push(j+' \n')
                }
            }
            return newArr;
        });
    },
    
};