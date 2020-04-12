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
const translated = ['汉化','漢化','翻訳','社','組','组','工房','机翻','重嵌']
const mosaic = ['無修','无修']
const regst = /[\[\]]/g; //替换
// 用于规范化本子名的工具类 测试方法
async function test(){
    //提取出文本文件里的名称
   let dirName =  await fsPromise.readFile('G:\\outx\\application\\菊姬作者分类.rbq',{encoding:'utf8',flag:'r'})
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
//    console.log(path.parse('G:\\菊姬plus\\ftl\\01-13\\[abgrund (さいかわゆさ)]\\[abgrund (さいかわゆさ)] ABGRUND [空気系★汉化]\\01_01.jpg'))

   let reg = /\[(.+?)\]/g;//中括号捕获 
   let reg2 = /\((.+?)\)|【(.+?)】/g;//捕获小括号
    //[4K[S版]掃圖組]
    let sReg = /\[4K\[(.+?)\]掃圖組\]/;//中括号捕获,[4K[S版]掃圖組]

    let reg_page = /\s\S話|第(.+?)話/;//捕获分卷信息
    let reg_page2 = /-\s(\d)*/;//捕获页数


    // console.log(shortName(test.name));

    for(let i = 0; i < bizNameArr.length; i++){
        if(!bizNameArr[i]){
            // console.log(bizNameArr[i],i)
            return
        }
        console.log(longName(bizNameArr[i]));
        // console.log(shortName(path.parse(bizNameArr[i]).name))
        // shortName(path.parse(bizNameArr[i]).name)
        // longName(bizNameArr[i])

        
    }
    
    //短url的处理
    function shortName(oldName,sol){
        let arrReg = [sReg,reg,reg2];
        let newName = oldName.toString();

        let newObj = {
            translatedGroup : '',
            noMosaic : '',
            authorName : '',
            authorArr : [],
            tagNameArr : []
        }
        
        let flag = true;

        for(let item of arrReg){
            let partArr = newName.match(item)
            if(partArr){
                newObj.tagNameArr.push(...partArr)

                flag = false;

                partArr.forEach((i)=>{
                    //剔除已捕获的标签
                    newName = newName.replace(i,'').trim();
                    //挑拣出汉化组
                    pickChoose(i,newObj,'translatedGroup',translated)
                    //挑拣出无修正
                    pickChoose(i,newObj,'noMosaic',mosaic)

                    function pickChoose( str, pickStr, index, regArr ){
                        //挑拣方法； 源 挑拣后 条件
                        for(let tItem of regArr){
                            if(pickStr[index]) break;
                            pickStr[index] = str.includes(tItem) ? i:'';
                        }
                    }
                })
            }
            //挑拣出作者名
            if(item === reg && partArr){

                let authorName = partArr[0]
                let tempName = partArr[0].match(reg2)
                if(tempName){
                    for(let item of tempName){
                        authorName = authorName.replace(item,'');
                    }
                }else{
                    tempName = []
                }
                
                newObj.authorName = authorName.replace(regst,'').trim();
                newObj.authorArr = [newObj.authorName,...tempName]
            }
        }
        //当前目录捕获不到时
        if(flag){
            console.log(oldName)
            return {
                tagName:oldName,
                success : false
            }
        }
        //有上层传入的特殊tag
        if(sol){
            newObj.tagNameArr.push(sol)
        }

        return {
            ...newObj,
            originName : oldName,
            bizName : newName,
            success : true
        }
    }

    //长url的处理
    function longName(dirName){
        //传入完整路径
        let dirParse = path.parse(dirName)
        let temp = shortName(dirParse.name)
        if(temp.success === true){
            return temp;
        }else if(temp.success === false){
            return shortName(dirParse.dir,temp.tagName)
        }
    }

//    console.log(test.name.replace(reg,''))
//    console.log(test.name.match(sReg))
    //   
    

}
test()