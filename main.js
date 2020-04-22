const { app, BrowserWindow } = require('electron')
const ipcRenderer = require('electron').ipcRenderer;

const client = require('electron-connect').client;

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win;
let xxx = 909;
console.log(99989)

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载index.html文件
  win.loadFile('index.html')

  // 打开开发者工具
  win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
  client.create(win);//热加载

  
  
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。



///发送消息
// setTimeout(()=>{
//   win.webContents.send('main-process-messages', 'main-process-messages show');
// },800);
// setInterval(()=>{
//   win.webContents.send('main-process-messages', 'main-process-messages show')
// },2000)
//接收消息
const ipcMain = require('electron').ipcMain;
const fileTo = require('./util/ftlToRAR');
ipcMain.on('ping', function(event, arg) {
  console.log(arg); // prints "ping"
  // win.webContents.send('main-process-messages', 'main-process-messages show')
  fileTo.intoSql(
    `SELECT * from src_table WHERE mosaic <> ''`,
    (error, results, fields) => {
        if (error) {
            throw error;
        }

        // 打印查询结果
        // console.log('SELECT result is: ', results);
        results = JSON.stringify(results);
        results = JSON.parse(results);
        console.log(results)
        win.webContents.send('main-process-messages', results)
  })
});
//electron-packager . fukaiitapp --out fukaiitapp --arch=x64 --overwrite
