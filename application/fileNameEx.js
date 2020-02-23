const fs = require('fs');
const fsPromise = fs.promises;
const exec = require('child_process').exec;
const iconv = require('iconv-lite')
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

/*readAllFileName('../src').then((data)=>{
    let rarArr = data.filter((item)=>{
        return item.includes('.rar')
    })

    console.log(rarArr)
    for(let i of rarArr){
        unRAR('../src/'+i,'../src/')
    }
    // console.log('./src/gRc01$froD12Ge1Qds23Ta.zip')
    // rarEx.getEntries().forEach((item)=>{
    //     console.log(item.rawEntryName().toString())
    // })
})*/
readAllFileName('../src').then((data)=>{
    let txtArr = data.filter((item)=>{
        return item.includes('.txt')
    })
    let arr = []
    for(let i of txtArr){
        arr.push(fsPromise.readFile('../src/'+ i))
    }
    return Promise.all(arr)
}).then((data)=>{
    // console.log(data)
    // let moveCloud = new Map();
    let allReg = /链接：(.+)/g
    let allCloudUrl = []
    for(let i of data){
        let text = iconv.decode(i,'gb2312')
        allCloudUrl.push(text.match(allReg)) 
    }
    //TODO lodash
    // console.log(...[allCloudUrl])
    let fsStreamWrite = fs.createWriteStream('./rbq.rbq')
    for(let i of allCloudUrl){
        for(let j of i){
            fsStreamWrite.write(j+'\n')
        }
    }
    fsStreamWrite.end()
    // let reg = /链接：(.+?) /g
    // let reg2 = /提取码：(.+)/g 
    // let allReg = /链接：(.+)/g

    // let text = iconv.decode(data,'gb2312')

    // let urlArr = text.match(reg)
    // let pwdArr = text.match(reg2)
    // console.log(text.match(allReg))
})

function execCmd(cmdStr,next){
    exec(cmdStr,function(err,stdout,stderr){
        console.log('运行完成')
    });
}
function unRAR(url,outUrl) {
    let dataPass = `start winrar e  ${url} ${outUrl}`
    execCmd(dataPass)
}