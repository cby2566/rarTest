
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;

//前台js

let file_name = document.getElementById('file_name2');
let textName = "";

file_name.addEventListener('click',function () {
    ipcRenderer.send('getFileDirName', 'openWindos');
})

ipcRenderer.on('fileDirName', function(event, message){
    textName = message.toString();
    document.querySelector('.text-name').innerHTML = textName;
    console.log(textName)
});