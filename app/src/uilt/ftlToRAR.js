// const fs = require("fs");
// const path = require('path');
// // var path = 'G://菊姬zip'
// const mysql = require('mysql');
const config = require('../config');

const translated = ['汉化','漢化','翻訳','翻译','翻譯','社','組','组','工房','机翻','重嵌','中文','Chinese','hinese']
const mosaic = ['無修','无修']
const regst = /[\[\]]/g; //替换
const regst2 = /[\(\)]/g; //替换小括号

let reg = /\[(.+?)\]/g;//中括号捕获 
let reg2 = /\((.+?)\)|【(.+?)】/g;//捕获小括号
 //[4K[S版]掃圖組]
 let sReg = /\[4K\[(.+?)\]掃圖組\]/;//中括号捕获,[4K[S版]掃圖組]

 let reg_page = /\s\S話|第(.+?)話/;//捕获分卷信息
 let reg_page2 = /-\s(\d)*/;//捕获页数

// 导出
module.exports = '99989'
module.exports = {
    //封装重命名函数,重命名文件后缀
    fileModify(fsp,dirName){
        console.log('filex:'+dirName)
        let psArr = []
        let p = fsp.readdir(dirName)
        .then((files)=>{
            files.forEach((filename)=>{
                let oldPath = dirName + '/' + filename;
                let newPath = dirName + '/' + filename.replace(/.ftc/, '.rar');
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
    //用于递归的读取文件
    readAllFileName2(fsp,url,option,overArr,callback){
        async function acc(_url){
           let arr = await fsp.readdir(_url,{withFileTypes:option}).catch((err)=>{console.log(err)});
           let newArr = arr.filter((item)=>{
               return item.isDirectory()
           })
           if(newArr.length == 0){
                // console.log(_url)
                if(callback){
                    //如果有callback，则添加使用他处理过的数据
                    overArr.push(callback(_url,arr));
                }else{
                    overArr.push(_url) 
                }
           }

           for(let item of arr){
                if(item.isDirectory()){
                    let n = path.join(_url,item.name)
                    // console.log('dir:',n)
                    await acc(n)
                }else{
                    let n = path.join(_url,item.name)
                    // console.log('file:',n)
                }
           }
        }
        return acc(url)
    },
    //长url的处理
    longName(dirName){
        //传入完整路径
        let dirParse = path.parse(dirName)

        //符号小数点会对path方法造成影响
        if(dirParse.ext){
            dirParse.name = dirParse.name + dirParse.ext
        }

        let arrTagName = [dirParse.name]
        let authorObj = longNameFnc(dirParse)
        //暂时处理方式 作者取不到的问题
        if(dirName.search){

        }

        //
        let temp = this.shortName(
            authorObj.name,
            arrTagName.length>1?arrTagName:[],
            authorObj.authorDir
            )

        // if(temp){
        return {...temp,url:dirName};
        // }
            //如果图片层级较深
        function longNameFnc(url){
            let parentName = url;
            if(parentName.base.match(reg)){
                return  {name : parentName.base, authorDir : parentAuthor(parentName)}
            }else if(!parentName.base && !parentName.name && parentName.root == parentName.dir){
                arrTagName = []
                return  {name : dirParse.name, authorDir : ''}
            }
            else{
                arrTagName.push(parentName.base)
                return longNameFnc(path.parse(parentName.dir));
            }
        }
        function parentAuthor(pathObj){
            let flag7path = pathObj.base.match(reg);
            if(flag7path){
                if(flag7path.length == 1 && flag7path[0].length == pathObj.base.length && !pathObj.base.includes('中文无修本')){
                    return pathObj.base
                }else{
                    return parentAuthor(path.parse(pathObj.dir))
                }
            }else{
                return ''
            }
        }
    },
    //短url的处理
    shortName( oldName, sol, authorDir){
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
                    this.pickChoose(i,newObj,'translatedGroup',translated)
                    //挑拣出无修正
                    this.pickChoose(i,newObj,'noMosaic',mosaic)

                })
            }
            //挑拣出作者名
            if(item === reg && partArr){

                //从父级取出来的作者名 authorDir
                let isDirAuthorArr = [];
                authorDir = authorDir.replace(regst,'').trim();
                if(authorDir.match(reg2)){
                    isDirAuthorArr.push(authorDir.replace(authorDir.match(reg2)[0],'').trim());
                    isDirAuthorArr.push(...authorDir.match(reg2))
                }else{
                    isDirAuthorArr.push(authorDir)
                }



                let authorName = partArr[0]

                //假如第一个方括号是 汉化组,就把索引右移一位
                for(let i = 0; i < partArr.length; i++){
                    if(translated.some( item => partArr[i].includes(item))){
                        authorName = partArr[ i + 1 ] ? partArr[ i + 1 ] : ''
                        break;
                    }else if(i == 0){
                        authorName = partArr[0]
                        break;
                    }else{

                    }
                }

                //新方法匹配作者
                if(authorDir){
                    for(let i = 0;i < partArr.length; i++){
                        for(let j = 0;j < isDirAuthorArr.length; j++){
                            if(partArr[i].includes[isDirAuthorArr[j]] || isDirAuthorArr[j].includes[partArr[i]]){
                                authorName = partArr[i];
                            }
                        }
                    }
                }
  
                let tempName = authorName.match(reg2)

                if(tempName){
                    for(let item of tempName){
                        authorName = authorName.replace(item,'');
                    }
                }else{
                    tempName = []
                }
                //当抓取的作者错误时 先虑掉汉化组
                if(authorName.includes(newObj.translatedGroup) || newObj.translatedGroup.includes(authorName)){
                    if(authorName && newObj.translatedGroup){
                        authorName = ''
                        newObj.authorName = ''
                    }
                }

                newObj.authorName = authorDir?authorDir:authorName.replace(regst,'').trim();
                newObj.authorArr = [newObj.authorName,...tempName]
            }
        }
        //当前目录捕获不到时
        if(flag){
            // return {
            //     tagName:oldName,
            //     success : false
            // }
        }
        //有上层传入的特殊tag
        if(sol && sol.length > 0){
            newObj.tagNameArr.push(sol);
            newName = newName +'$'+ sol.join();
            oldName = oldName +'$'+ sol.join();
        }

        return {
            ...newObj,
            originName : oldName,
            bizName : newName,
            success : true
        }
    },
    //挑拣方法； 源 挑拣后 条件
    pickChoose( str, pickStr, index, regArr ){
        for(let tItem of regArr){
            if(pickStr[index]) break;
            pickStr[index] = str.includes(tItem) ? str:'';
        }
    },
    insertSql(keys, values, table = 'src_table'){
        // 连接信息
        const connection = mysql.createConnection(config);
        // 建立连接
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
        });
    
        // 批量插入
        //执行sql   第二个参数要加"[]"
        // let arr1 = ['author','biz_name','origin_name','other','url'].join()
            
        let userAddSql = `INSERT INTO ${table}(${keys}) VALUES ? `;
        let query = connection.query(userAddSql,[values],function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
        console.log(query)
    
        connection.end();
    },
    intoSql(sql_key,fn){
        // 连接信息
        const connection = mysql.createConnection(config);
        // 建立连接
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
        });
    
        // 执行查询
        connection.query(sql_key,fn);
    
        connection.end();
    },
    ok(){
        console.log('ok')
        return 'say ok'
    }
}
///////////////////
