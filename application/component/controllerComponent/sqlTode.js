
const fs = require('fs');
const fsPromise = fs.promises;
const fileTo = require('../../ftlToRAR.js');


module.exports ={
    likeSelect(value,factor){
        return new Promise((resolve, reject)=>{
            let sqlQuery = `SELECT * from src_table WHERE ${factor} LIKE '%${value}%'`
            // let sqlQuery = `SELECT * from src_table WHERE url = 'G:\\\\菊姬plus\\\\ftl\\\\04-22\\\\\[C.N.P (Clone人間)]\\\\[Clone人間\\\] 雌力 \\\[日原版\\\]'`
            console.log(sqlQuery)
            fileTo.intoSql(sqlQuery,function(err, result) {
                if(err){
                    console.log('err:' + err)
                    reject(err)
                }
                // console.log(result)
                resolve(result);
            })
        }).catch((error)=>{
            console.log('err:'+error)
        })
    },
    //批量删除
    anyDelete(value){
        return new Promise((resolve, reject)=>{
            let sqlQuery = `delete from src_table where origin_name in (  ?  ) `
            console.log(sqlQuery)
            fileTo.intoSql(sqlQuery,[value],function(err, result) {
                if(err){
                    console.log('err:' + err)
                    reject(err)
                }
                console.log(result)
                resolve(result);
            })
        }).catch((error)=>{
            console.log('err:'+error)
        })
    }
};