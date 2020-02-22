const fs = require('fs');
const fsPromise = fs.promises;
const AdmZip = require('adm-zip');

function readAllFileName(url){
   return fsPromise.readdir(url)
    .then((data)=>{
        // console.log(data)
        return data;
    }).catch((err)=>{
        console.log('err:',err)
    })
}

function filterName(nameArr){
    if(!Array.isArray(nameArr)) return;
    let reg = /\[(.+?)\]/g;
    let regs = /[\[\]]/g; 
    let arrObj = [];
    
    for(let item of nameArr){
        // console.log(item.match(reg))
        let tag = item.match(reg);
        if(tag){
            tag = tag.map((i)=>{
                return i.replace(regs,'');
            })
            arrObj.push(tag[0]);
        }
    }
    ///
    let author = new Map();
    let reg_ = /\((.+?)\)/g;
    let regs_ = /\(|\)/g;//不知道为什么要加中线

    for(let list of arrObj){
        let text = list.match(reg_) ? list.match(reg_) : [`(${list})`];
        let value = list.replace(text,'').trim().split('  ');
        let key = text[0].replace(regs_,'');
        value.push(key);
        author.set(key,value);
    }
    return author
}
// readAllFileName('/菊姬')
async function start(){
    let fileNameArr = await readAllFileName('/菊姬zip')
    let arr1 = filterName(fileNameArr)
    fileNameArr = await readAllFileName('/菊姬')
    let arr2 = filterName(fileNameArr)
    // console.log(arr2)
    for(let i of arr1.keys()){
        if(arr2.has(i)){
            console.log(i,arr2.get(i))
        }
    }
    //交集
    //let intersection = arr1.filter( v => arr2.includes(v))
}

readAllFileName('../src').then((data)=>{
    let rarArr = data.filter((item)=>{
        return item.includes('.rar')
    })
    // console.log('./src/gRc01$froD12Ge1Qds23Ta.zip')
    let rarEx = new AdmZip('./a2.zip');
    console.log(rarEx.getEntries())
    // rarEx.getEntries().forEach((item)=>{
    //     console.log(item.rawEntryName().toString())
    // })
})