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
let putUrl = "G:\\outx\\application\\dirname.rbq"

console.log(path.parse(originUrl))
console.log(path.join(originUrl))
console.log('---')
//从菊姬plus开始
let reg = /\[(.+?)\]/g;//捕获
let regs = /[\[\]]/g; //替换
//循环递归文件夹
async function acc(url){
    
    let arr = []
    let i = await fileTo.readAllFileName2(fsPromise,url,true,arr,function(dirUrl){
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
    })
    // console.log(i)
    console.log(123)
    console.log(arr)
    intoSql('',arr)
    //关闭数据库
    // connection.end();

    //以下是写入
    // console.log(fsPromise.createWriteStream) //抛出异常
    // let fsStreamWrite = fs.createWriteStream(putUrl)
    // for(let j of arr){
    //     fsStreamWrite.write(`${j}`+'\n')
    // }
    // fsStreamWrite.end()
}
acc(originUrl)

//以下是为进数据库，做准备
async function acc2(url){
    
    let arr = []
    let i = await fileTo.readAllFileName2(fsPromise,url,true,arr)
    console.log(i)
    console.log(123)
    console.log(arr)

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
