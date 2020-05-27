const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

const fileTo = require('./ftlToRAR')

// let originUrl = 'G:/菊姬plus/ftl/01-19'
let originUrl = `G:\\BaiduNetdiskDownload\\2020新年快乐包\\jj`

async function acc(){
    //读取文件夹中ftc的全部文件名
   let originDirArr = await fileTo.readAllFileName(fsPromise,originUrl)
   console.log(originDirArr)
    //修改ftl格式
   let m = await  fileTo.fileModify(fsPromise,originUrl)
   console.log(m)
}

//对比两个文本文件里数组的交集，用于去重
function readAll(){
    let arr = []//菊姬单行本
    let temp1 = [] 
    let arr2 = []//汉化区单行本
    let temp2 = [] 
    //读取文本全部内容
    fsPromise.readFile('G:\\outx\\application\\菊姬作者分类.rbq'
    ,{encoding:'utf8',flag:'r'}
    )
    .then((data)=>{
        temp1 = data.split('\n').map(item=> item.split(','))

        for(let i of temp1){
            if(i){
                arr.push(i[0])
            }
        }
        return fsPromise.readFile('G:\\outx\\application\\菊姬单行本.rbq'
        ,{encoding:'utf8',flag:'r'}
        )
    }).then((data)=>{
        temp2 = data.split('\n').map(item=> item.split(','))
        for(let i of temp2){
            if(i){
                arr2.push(i[0])
            }
        }
        //数组方法求交集
        console.log(arr.length,arr2.length)
        let intersection = arr.filter((v) =>{
            if(!v) return false;

            if(arr2.includes(v)){

                let arrx1 = path.parse(temp1[arr.indexOf(v)][1]).base
                let arrx2 = path.parse(temp2[arr2.indexOf(v)][1]).base
                // console.log(arrx1.match(/\[(.+?)\]/g))
                // console.log(arrx2.match(/\[(.+?)\]/g))
                let reg = /\[(.+?)\]/g
                if(arrx1.match(reg)[0] == arrx2.match(reg)[0] || arrx1.match(reg)[0] == arrx2.match(reg)[1]){
                    return true
                }else{
                    console.log(arrx1)
                    console.log(arrx2)
                    return false
                }
                
            }else{
                return false
            }
        })
        console.log(intersection.length,'本重复')

        let indexNum = []
        for(let item of intersection){
            indexNum.push(item,temp1[arr.indexOf(item)],
            temp2[arr2.indexOf(item)])
        }
        console.log(indexNum.length)
        //以下是写入文件

        let fsStreamWrite = fs.createWriteStream('./重复本arr3.rbq')
        for(let j of indexNum){
            fsStreamWrite.write(`${Array.isArray(j)?j[1]:j}`+'\n')
        }
        fsStreamWrite.end()

    })
}


// readAll()



//删除重复的本子  （先删除[4K[S版]掃圖組]）
// function deleteFile(){
//     let fileDname = './重复本arr.rbq'
//     fsPromise.readFile(fileDname,{encoding:'utf8',flag:'r'})
//     .then((data)=>{
//         // console.log(data.split('\n'))
//         let deletMap = data.split('\n').filter((item)=>{return item.includes('[4K[S版]掃圖組]')})
//         console.log(deletMap)
//         for(let url of deletMap){
//             fsPromise.rename(url,'G:\\单行本\\temp\\').catch(()=>{})
//         }
        
//     })
// }

//
// deleteFile()

// 用于规范化本子名的工具类 测试方法
async function test(){
    //提取出文本文件里的名称
//    let dirName =  await fsPromise.readFile('G:\\outx\\application\\单行本啊啊啊.rbq',{encoding:'utf8',flag:'r'})
    let dirName =  await fsPromise.readFile('G:\\outx\\application\\04-30.rbq',{encoding:'utf8',flag:'r'})
//    console.log(dirName)
   //提取出路径名
   let dirNameArr = dirName.split('\n');
   let bizNameArr = []
   for(let i = 0;i < dirNameArr.length; i++){
        //保持完整路径url
        bizNameArr.push(dirNameArr[i].split(' -> ')[1]);

   }
//    console.log(bizNameArr);
   let test = path.parse(bizNameArr[55])
//    console.log(test);
//    console.log(path.parse('G:\\菊姬plus\\ftl\\01-18\\[サークル尾髭丹]\\[尾髭丹] 夏どぴゅっ ～いつでも排卵日着床200％女子たち～\\2_ブルマ\\ブルマ１'))
//    console.log('----')
//    console.log(fileTo.longName('G:\\菊姬plus\\ftl\\02-22\\[アシオミマサト]\\[アシオミマサト] クライムガールズ3.5 (COMIC 夢幻転生 2017年5月号)【瓜皮汉化】\\[アシオミマサト]クライムガールズ3.5(COMIC 夢幻転生 2017年5月号)【瓜皮汉化】'))
//     return;



    // console.log(shortName(test.name));
   let newobjarr = []

    for(let i = 0; i < bizNameArr.length; i++){
        if(!bizNameArr[i]){
            // console.log(bizNameArr[i],i)
            break;
        }
        newobjarr.push(fileTo.longName(bizNameArr[i]))
        // console.log(fileTo.longName(bizNameArr[i]));
        // console.log(shortName(path.parse(bizNameArr[i]).name))
        // shortName(path.parse(bizNameArr[i]).name)
        // longName(bizNameArr[i])
        
    }
    let values = []
    
    for(let items of newobjarr){
        let {authorName, authorArr, bizName, originName, tagNameArr, noMosaic,translatedGroup, url} = items;
        let valuesArr = [authorName, authorArr, bizName, originName, tagNameArr, noMosaic,translatedGroup, url];
        valuesArr = valuesArr.map((item) => {
            return item&&item.toString();
        });
        values.push(valuesArr)
    }
    let keys = ['author','author_arr','biz_name','origin_name','other','mosaic','translated_group','url']


    fileTo.insertSql(keys,values,'src_table')
    return
    //查询
    fileTo.intoSql(
        `SELECT * from src_table WHERE mosaic <> ''`,
        (error, results, fields) => {
            if (error) {
                throw error;
            }

            // 打印查询结果
            // console.log('SELECT result is: ', results);
            results = JSON.stringify(results);
            results = JSON.parse(results);
            console.log(results)
    })

//    console.log(test.name.replace(reg,''))
//    console.log(test.name.match(sReg))
    //   
    

}
test()
