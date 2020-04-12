const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');
const fileTo = require('./ftlToRAR')

const mysql = require('mysql');
const config = require('../config');

// 连接信息
// const connection = mysql.createConnection(config);

// let originUrl = "G:\\菊姬plus\\ftl\\01-13\\[かるま龍狼]"
let originUrl = "G:\\菊姬plus\\ftl"
// let originUrl = "G:\\BaiduNetdiskDownload\\2020新年快乐包\\jj"
// let originUrl = "G:\\单行本\\2019"

// let putUrl = "G:\\outx\\application\\dirname.rbq"


// let putUrl = "G:\\outx\\application\\菊姬单行本.rbq"
// let  putUrl = "G:\\outx\\application\\汉化区2019年部分单行本.rbq"
let  putUrl = "G:\\outx\\application\\菊姬作者分类.rbq"

console.log(path.parse(originUrl))
console.log(path.join(originUrl))
console.log('---')
//从菊姬plus开始
let reg = /\[(.+?)\]/g;//中括号捕获
let reg2 = /\((.+?)\)|【(.+?)】/g;//捕获小括号
//[4K[S版]掃圖組]
let sReg = /\[4K\[(.+?)\]掃圖組\]/g;//中括号捕获,[4K[S版]掃圖組]

let reg_page = /\s\S話|第(.+?)話/;//捕获分卷信息
let reg_page2 = /-\s(\d)*/;//捕获页数

let regs = /[\[\]]/g; //替换
//循环递归文件夹
async function acc(url){
    
    let arr = []
    let i = await fileTo.readAllFileName2(fsPromise,url,true,arr,function(dirUrl){
        // let relUrl = path.parse(dirUrl).base;
        // console.log(dirUrl)
        // return relUrl;
        //以下是过滤特殊tag或添加完整路径
        return setFileName(dirUrl)
    })
    // console.log(i)
    console.log(123)
    console.log(arr)
    console.log(arr.length)
    // intoSql('',arr)
    //关闭数据库
    // connection.end();

    //以下是写入
    // console.log(fsPromise.createWriteStream) //抛出异常
    let fsStreamWrite = fs.createWriteStream(putUrl)
    for(let j of arr){
        if(Array.isArray(j)){
            fsStreamWrite.write(`${j[0]} -> ${j[1]}`+'\n')
        }else{
            fsStreamWrite.write(`${j}`+'\n')
        }
        
    }
    fsStreamWrite.end()
}
acc(originUrl)

//以下是为进数据库，做准备
async function acc2(url){
    
    let arr = []
    let i = await fileTo.readAllFileName2(fsPromise,url,true,arr)
    console.log(i)
    console.log(123)
    console.log(arr.keys())

    //以下是写入
    // console.log(fsPromise.createWriteStream) //抛出异常
    // let fsStreamWrite = fs.createWriteStream(putUrl)
    // for(let j of arr){
    //     fsStreamWrite.write(`${j}`+'\n')
    // }
    // fsStreamWrite.end()
}
function intoSql(key,values){
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
    // 执行插入
    // connection.query(`INSERT INTO old_table (id, name)VALUES( 88, "lijian")`,(err,result)=>{if(err) throw err; });

    // 批量插入
        //执行sql   第二个参数要加"[]"
        let arr1 = ['author','biz_name','origin_name','other','url'].join()
        
    let userAddSql = `INSERT INTO src_table(${arr1}) VALUES ? `;
    let query = connection.query(userAddSql,[values],function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }
    });
    console.log(query.sql)
    // 执行查询
    connection.query('SELECT * FROM src_table',
        function (error, results, fields) {
            if (error) {
                throw error;
            }

            // 打印查询结果
            console.log('SELECT result is: ', results);
        });
    connection.end();
}


//作为入库前的回调
//TODO 作为名称分割，需要更详细的顺序兼容，而不是指定第一个就是作者名
function disCallback(dirUrl){
    let item = {}
    let relUrl = path.parse(dirUrl).base;
    let otherArr = relUrl.match(reg);
    item.url = dirUrl;
    item.originName = relUrl;
    item.bizName = relUrl;

    if(otherArr && otherArr.length > 0){
        otherArr.map(function(items){
            item.bizName = item.bizName.replace(items,'')
        })
        item.author = otherArr[0]?otherArr.shift():'';
        item.other = otherArr.join();
    }else{
        item.author = '';
        item.other = '';
    }
    
    console.log(item)
    let {author,bizName,originName,other,url} = item
    // intoSql('',[author,bizName,originName,other,url])
    return [author,bizName,originName,other,url];
}

//文件名筛选 作为单行本和菊姬单行本比较
function setFileName(oldUrl){
    let dirname = oldUrl;
    let oliName = path.parse(oldUrl).base
    oliName = oliName.replace(sReg,'').replace(reg,'').replace(reg2,'').replace(reg_page,'').replace(reg_page2,'').trim()

    return [oliName,dirname]
}