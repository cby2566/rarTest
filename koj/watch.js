const fs = require('fs');
//监听文件模块
// fs.watch('./zip/',{
//     persistent : true, //已被监视是否继续
//     recursive : false,   //是否监听子目录
//     encoding : 'utf8' 
// },function(eventType,fileName){
//     console.log(eventType,fileName)
// })
function text1(){
    let fsw = fs.watch('./zip/',{
        persistent : true,
        recursive : true,
        encoding : 'utf8'
    })

    fsw.on('change',function(eventType,fileName){
        console.log(eventType,fileName,123)
    })

    // setTimeout(function(){
    //     console.log('over')
    //     fsw.close()
    // },10000)
}


const exec = require('child_process').execSync;  //引入child_process模块
function text4(data,outUrl){
    function execCmd(cmdStr){
        let data = exec(cmdStr);
    }
    //dos调用winra进行解压
    let dataPass = execCmd(`start winrar x -pmayuyu123  ${data} ${outUrl}`)
}
// text4('../zip/gRc01$froD11Ge5Qds21Tap2.rar','../zip/')

// ls.stdout.on('data',(data)=>{
//     console.log('stdout'+data)
// })
// ls.stderr.on('data',(data)=>{
//     console.error('stderr'+data)
// })
// ls.on('close',(data)=>{
//     console.log('close'+data)
// })
// rename 实现剪切
fs.rename('../zip/gRc01$froD11Ge0Qdr23Tap1.rar','G:\\outx\\koj\\gRc01$froD11Ge0Qdr23Tap1.rar',function (err) {
    console.log(err)
})
// fs.rename('../zip/ok/','G:\\outx\\koj\\ok\\',function (err) {
//     console.log(err)
// })