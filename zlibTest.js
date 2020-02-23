const zlib = require('zlib')
const fs = require('fs')
var AdmZip = require('adm-zip');  //用于读取未解压的zip包




function text() {
    let inp = fs.createReadStream('./test.js')
    let out = fs.createWriteStream('./test.js.zip')
    let gzip = zlib.createGzip()
    //简单压缩 可指定 gz zip
    inp.pipe(gzip).on('error',()=>{
        console.log('压缩错误1')
    }).pipe(out).on('error',()=>{
        console.log('压缩错误2')
    });
}
// text()
//解压缩，好像只能buffer格式

//不解压 读取文件内容模块 AdmZip

//?child_process模块 解压密码

//功能二
//不解压的情况下读取相关文件
let zipPath = './outx.zip'
function printData(){
    var zip = new AdmZip(zipPath);
    // var zipEntries = zip.getEntries();
    // console.log(zipEntries[0])
    zip.readFileAsync(zip.getEntry('img/'),function(data) {
        console.log(data)
    })
    // console.log(zip.getEntry('ccc.jpg'))
    zip.readAsTextAsync(zip.getEntry('readFlie.js'), function(err,data){
        console.log(err,data)
    })

    // console.log(zipEntries[0].rawEntryName.toString());
    // zipEntries.forEach((item) => {
    //     if(item.name=="a.txt")console.log(item.getData().toString());
    //     if (item.isDirectory == false) {
    //         console.log(item);
    //     }
    // });
}
const exec = require('child_process').exec;  //引入child_process模块
function text4(data,outUrl){
    //D:\js学习\outx>start winrar e -r[] -p123  pws.rar d:\js学习
    //D:\js学习\outx>start winrar x -r[] -p123  pws.rar d:\js学习
    //shell
    

    function execCmd(cmdStr,next){
        let data = exec(cmdStr,function(err,stdout,stderr){
            // let data2 =next({
            //     err:err,
            //     stdout:stdout,
            //     stderr:stderr
            // });
            // console.log(data2)
            console.log(1,err)
            console.log(2,stdout)
            console.log(3,stderr)
            
        });
        console.log("8080",data)
    }

    //dos调用winra进行解压
    let dataPass = execCmd(`start winrar x -pmayuyu123  ${data} ${outUrl}`,function (params) {
    console.log(params)
    console.log(dataPass)
    })
}


// const exec = require('child_process').exec

// const build = exec('npm run build')
// build.stdout.on('data', data => console.log('stdout: ', data)) //监听进度

//rundll32.exe C:\WINDOWS\system32\shimgvw.dll,ImageView_Fullscreen D:\js学习\outx\ccc.jpg
//打开系统默认图片查看器
//用”“隔开参数就行

text4('../菊姬zip/gRc01$froD10Ge7Qds23Tap1.rar','./img')

function text3(){
    let url = ''
    // let zip = new AdmZip();
}