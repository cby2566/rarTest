const fs = require('fs');
const fsPromise = fs.promises;
// const exec = require('child_process').exec;
const iconv = require('iconv-lite')
// console.log(iconv)
const fileTo = require('./ftlToRAR')

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
let textUrl = 'E:/work_work/jj/新年和无修80g'
///正式操作-》
function texts() {
    //用于解压飞猫网盘的那些链接，然后导出(误)
    /* 
    ** 《提取度盘链接》
    ** 需要先手动解压到src文件夹下
    ** 读取以及解压好的txt文件中的度盘链接。
    ** 导出的rbq文件是一排度盘链接
    */
    var arr7 = []
    readAllFileName('../src').then((data)=>{
        let txtArr = data.filter((item)=>{
            return item.includes('.txt')
        })
        let arr = []
        for(let i of txtArr){
            arr.push(fsPromise.readFile('../src/'+ i))
        }
        arr7 = txtArr
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
        console.log(allCloudUrl.length)
        console.log(arr7,arr7.length)


        let fsStreamWrite = fs.createWriteStream('./rbq3.rbq')
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
}
texts()
console.log('write')
// let job = new Map()
// job.set('a','123')
// job.set('b','345')
// job.set('c','567')
// console.log(job)
// fileTo.mapWriteFile(fs,'./rbq.dat',job)

let url2 ="G:/菊姬plus/ftl/01-19"
let filesDir = []; //gRc01$froD11Ge6Qdr22Tap1
let authorArr = [];//含gRc01$froD11Ge6Qdr22Tap1的绝对路径
let over = []; //含作者绝对路径
let author2 = []//作者名
function doFile(){
    //导出压缩包的名和作者名的对应关系
    fileTo.readAllFileName(fsPromise,url2).then((files)=>{
        //剔除rar
        for(let i of files){
            if(!i.includes('.rar')&&!i.includes('[')){
                filesDir.push(i)
            }
        }
        let ps = []
        filesDir.forEach((item)=>{
            let childUrl = `${url2}/${item}`
            let str = `${item} -> ${((fs.statSync(`${childUrl}.rar`).size)/1048576).toFixed(2)}MB`
            ps.push(fileTo.readAllFileName(fsPromise,childUrl,str))
            authorArr.push(childUrl)
        })
        return Promise.all(ps)
    })
    /**移动文件 start */
    .then((data)=>{
        
        let p = []
        for(let i = 0; i < data.length; i++){
            // console.log(`${authorArr[i]}:${data[i][0]}`)
            let text = `${authorArr[i]}/${data[i][0]}`
            over.push(text)
            author2.push(data[i][0])
            p.push(fileTo.readAllFileName(fsPromise,text))//拼接用于写入的字符串
        }
        author2 = Array.from(new Set(author2))
        return Promise.all(p)
    })
    .then((data)=>{
        //过滤掉【下载自用可删除此txt文件】.txt
        //移动文件
        data = data.map((i)=>{
            return i.filter( item =>{return !item.includes('.txt')})
        })
        let ps = []

        //在移动之前必须创建作者目录
        author2.forEach((item)=>{
            fs.mkdirSync(`${url2}/${item}`)
        })
        
        
        data.map((item,index)=>{
            let pxp = over[index].replace("/"+filesDir[index],"")
            item.map((value,itx)=>{
                console.log(`${over[index]}/${value}`)
                console.log(`${pxp}/${value}`)
                ps.push(fsPromise.rename(`${over[index]}/${value}`,`${pxp}/${value}`))
            })
        })
        // fs.renameSync(`${authorArr[i]}/${data[i][0]}`,`${url2}/${data[i][0]}`)
        return Promise.all(ps)
    })
    .then((data)=>{
        console.log(data)
    }).catch((error)=>{
        console.log('error',error)
    })
    /**移动文件 end */
    /**写入 start */
    // .then((data)=>{
    //     console.log(data)
    //     // 写入文件名组合
    //     fileTo.mapWriteFile(fs,'./rbq.dat',data)
    // })
    /**写入 end */
}
// doFile()
// fs.renameSync(`G:\\菊姬plus\\ftl\\01-18\\gRc01$froD11Ge6Qdr22Tap1\\[翁計画 (師走の翁)]\\[師走の翁] ##早期作品##`,`G:\\菊姬plus\\ftl\\01-18\\[翁計画 (師走の翁)]\\[師走の翁] ##早期作品##`)
// .forEach((item)=>{
//     fileTo.readAllFileName(fsPromise,`${url2}/${item}`).then((data)=>{
//         console.log(data)
//     })
// })

// rename 实现剪切
// fs.renameSync(`${url2}/gRc01$froD11Ge6Qds23Tap2/[アルセノテリス (Rebis)]`,`${url2}/[アルセノテリス (Rebis)]`)

