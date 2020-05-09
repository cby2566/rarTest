const ipcMain = require('electron').ipcMain;
const fileTo = require('../../ftlToRAR');
const path = require('path');
const fs = require("fs");
const fsPromise = fs.promises;
const flieNameEx =require('./fileNameEx.js');
const sqlTode =require('./sqlTode.js');

let str = ""//处理值
let localListWindow = null;
module.exports = {
    xListener(win,dialog,BrowserWindow,url){
        //打开文件选择窗口，并返回所选路径--文件夹路径
        ipcMain.on('getFileDirName', function(event, arg) {
            dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]})
            .then((data)=>{
                console.log(data.filePaths)
                // fileTo.readAllFileName(fsPromise,data.filePaths[0])
                if(data.filePaths.length < 1) return;
                fileTo.readAllFileName(fsPromise,data.filePaths[0])
                .then((data1)=>{
                    // console.log(data1)
                    console.log(arg)
                    win.webContents.send('fileDirName', {dir:data.filePaths,list:data1})
                })
                // win.webContents.send('fileDirName', data.filePaths)
            })
        });
        //打开新窗口
        ipcMain.on('openNewWin',async function(event, arg) {
            str = await flieNameEx.texts(arg)
            if(localListWindow) {
                initData();
                return;
            }
            localListWindow = new BrowserWindow({
                width: 800,
                height: 600,
                icon: './favicon.ico',
                webPreferences: {
                  nodeIntegration: true
                }
              })
            localListWindow.loadURL(`file://${url}/index copy.html`);
            localListWindow.webContents.openDevTools()
            localListWindow.on("close", function(){
                localListWindow = null;
            })
            // win.loadURL(`file://${__dirname}/index.html`);
        });
        //初始化新窗口数据
        ipcMain.on('ping',initData);
        function initData() {
            if(localListWindow){
                localListWindow.webContents.send('main-process-messages', str)
            }
        }
        //重命名压缩文件
        ipcMain.on('rename',async function(event, arg) {
            let originUrl = arg;
            //读取文件夹中ftc的全部文件名
            let originDirArr = await fileTo.readAllFileName(fsPromise,originUrl);
            console.log('重命名压缩文件'+originDirArr);
                //修改ftl格式
            let m = await  fileTo.fileModify(fsPromise,originUrl);
            console.log(m);
        });

        //模糊查询
        ipcMain.on('likeSelect',async function(event, arg) {
            console.log(arg)
            let result =  await sqlTode.likeSelect(arg['value'],arg['factor'])
            win.webContents.send('likeSelectResult', result)
        });
        //批量删除
        ipcMain.on('anyDelete',async function(event, arg) {
            console.log(arg)
            // sqlTode.anyDelete(arg)
            let result =  await sqlTode.anyDelete(arg)
        });
        ipcMain.on('fsPromise',async function(event, arg) {
            console.log(arg,'77777777')
            console.log(fileTo)
            win.webContents.send('fsPromise3', fileTo.fileModify)
        });
    }
}
