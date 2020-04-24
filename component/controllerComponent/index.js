const ipcMain = require('electron').ipcMain;
const fileTo = require('../../util/ftlToRAR');
const path = require('path');
const fs = require("fs");
const fsPromise = fs.promises;
module.exports = {
    xListener(win,dialog){
        //打开文件选择窗口，并返回所选路径--文件夹路径
        ipcMain.on('getFileDirName', function(event, arg) {
            dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]})
            .then((data)=>{
                console.log(data.filePaths)
                // fileTo.readAllFileName(fsPromise,data.filePaths[0])
                fileTo.readAllFileName(fsPromise,data.filePaths[0])
                .then((data1)=>{
                    console.log(data1)
                })
                win.webContents.send('fileDirName', data.filePaths)
            })
        });

    }
}
