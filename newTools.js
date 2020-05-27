const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

const fileTo = require('./application/ftlToRAR')


//读取文本全部内容


async function test1() {
    //删除空文件夹
    let data = await fsPromise.readFile('G:\\outx\\application\\查询1.txt',{encoding:'utf8',flag:'r'})
    let temp1 = data.split('\n').map(item=> item.replace(/[\r"]/g,''));
    // console.log(path.parse(temp1[0]))
    let arr = []
    for(let item in temp1){
        if(temp1[item]){
            var originDirArr = await fileTo.readAllFileName(fsPromise,temp1[item]);
            // console.log(originDirArr.length)
            if(originDirArr && originDirArr.length == 0){
                // console.log(temp1[item])
                // arr.push(temp1[item])
                var ax = await fsPromise.rmdir(temp1[item])
                console.log(ax)
            }
        }
    }

}
async function test2() {

    let data = await fsPromise.readFile('G:\\outx\\application\\查询1.txt',{encoding:'utf8',flag:'r'})
    let temp1 = data.split('\n').map(item=> item.replace(/[\r"]/g,''));
    // console.log(path.parse(temp1[0]))
    let arr = []

}

// async function test12() {
//     //重命名
//     let oUrl = 'G:\\菊姬plus\\ftl\\01-13\\[インペリアルチキン (藤坂空樹)]\\[藤坂空樹] コイカノ×アイカ 01-25话 完结『樱翼汉化组』'
//     let xyzUrl = await fileTo.readAllFileName(fsPromise,oUrl);
//     for(let item of xyzUrl){
//         let oldName =  path.join(oUrl,item);
//         let newNamme = item.replace(/\[|\]/g,' ').replace('『','\[').replace('』','\]').replace('恋着的她X爱着的她','コイカノ×アイカ')
//         newNamme = path.join(oUrl,newNamme);
//         console.log(newNamme);
//         await fsPromise.rename(oldName,newNamme)
//     }

// }

async function y17(){

    let  biz = require('./application/作者分类重复的本.json');
    let hbiz = require('./application/其中汉化的.json');


    let fbizArr1 = [];
    let fbizArr2 = [];
    let item = biz['RECORDS'];

    let item_h = hbiz['RECORDS'];
    for(let index in biz['RECORDS']){


        if(item[index].biz_name.includes('杂图')){
            
        }else{
            
            if(!item_h.some(items => items.biz_name == item[index].biz_name )){
                
            }else{
                fbizArr1.push(item[index])
                if(item[index].origin_name.includes('日原版')){
                    fbizArr2.push(item[index])
                }else{
                    
                }
            }
            
        }
    }
    console.log(fbizArr1.length)
    console.log(fbizArr2.length)
    let fbizArr3 = []
    // fbizArr1.map((v,i)=>{

    //     if(!fbizArr2.some(items => items == v.biz_name )){
    //         fbizArr3.push(v)
    //     }

    //     return v;
    // })

    //     console.log(fbizArr3)
    let oUrl = 'G:\\delTemp'
    for(let y of fbizArr2){
        console.log(y.url)
        await fsPromise.rename(y.url,path.join(oUrl,y.origin_name))
    }

    


    
}
// y17()

function y18(){
    let aaa = 'G:\\其他本子\\ntr合集\\[个人收藏] NTR 调教 催眠 凌辱 400本[全汉化][度盘][32G]_fffir\\[フエタキシ]福山同学 不良少女\\精灵女子高中\ハイエルフ×ハイスクール襲撃編前日 [中国翻訳]'
    console.log(aaa.search(/\\\[フエタキシ\]\\/))
}
y18()
// for(let y of fbizArr1){
//     console.log(y.url)
// }
