const fs = require("fs");
const fsPromise = fs.promises;
const readline = require("readline");
const path = require("path");

let gtFileDirList = [];

// 按行 读取文本文件
async function processLineByLine(fileName) {
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let arr = [];

  for await (const line of rl) {
    try {
      console.log(line);
      arr.push(line);
    } catch (e) {
      console.log(line);
    }
  }
  return arr;
}

// 递归读取全部文件
function readAllFileName2(url, callback) {
  async function acc(_url) {
    const fileDirentList = await fsPromise.readdir(_url, {
      withFileTypes: true,
    });
    for (let fileDirentObj of fileDirentList) {
      const _fileUrl = path.join(_url, fileDirentObj.name);
      if (fileDirentObj.isDirectory()) {
        // 文件夹
        if (_fileUrl.includes("哥特")) {
          gtFileDirList.push(_fileUrl);
        } else {
          await acc(_fileUrl);
        }
      } else {
        // 非目录
        callback(_fileUrl);
      }
    }
  }
  return acc(url);
}

// withFileTypes true 返回值 包含 <fs.Dirent> 对象
processLineByLine("./该删除目录.txt").then(async (res) => {
  let i = 0;
  await readAllFileName2("./", function (fileName) {
    if (res.some((str) => fileName.includes(str))) {
      i++;
      fs.unlink(fileName, function (err) {
        if (err) throw err;
        // 如果没有错误，则文件已成功删除
        console.log("File deleted!", fileName);
      });
    }
  });
  console.log("已删除：", i);

  // 删除目录类型的文件夹而不是只删除文件
  //、、、由于莫名的权限问题，我使用命令行删除文件夹
  // for (let j of gtFileDirList) {
  //   const oldPath = j
  //   const newPath = './newFolder';

  //   fs.rename(oldPath, newPath, (err) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       console.log(`${oldPath} 已重命名为 ${newPath}`);
  //     }
  //   });
    
  // }
});

const { exec } = require('child_process');

const currentPath = process.cwd();

const searchString = '*哥特*';
const escapedSearchString = searchString.replace(/([*?])/g, "`$1");

const command = `PowerShell.exe -Command "Get-ChildItem -Path '${currentPath}' -Recurse -Directory | Where-Object {\`$_.Name -like '${escapedSearchString}'} | ForEach-Object { Write-Host \`\$_.FullName; Remove-Item -Path \`\$_.FullName -Force -Recurse }"`;

exec(command, { encoding: 'utf8', shell: 'powershell.exe' }, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行命令时发生错误：${error}`);
    return;
  }

  console.log(stdout);
  console.error(stderr);
});


/**
 * $currentPath = Get-Location
 * 删除当前目录和子目录中，含newFolder的文件和目录
 * Get-ChildItem -Path $currentPath -Recurse | Where-Object {$_.FullName -like "*\newFolder\*"} | Remove-Item -Force -Recurse
 * Get-ChildItem -Path $currentPath -Recurse | Where-Object {$_.FullName -like "*newFolder*"} | Remove-Item -Force -Recurse
 * 
 * 删除当前目录和子目录中，含newFolder的仅目录
 * Get-ChildItem -Path $currentPath -Recurse -Directory | Where-Object {$_.Name -like "*newFolder*"} | Remove-Item -Force -Recurse
 * 
 * Get-ChildItem -Path $currentPath -Recurse -Directory | Where-Object {$_.Name -like "*newFolder*"} | ForEach-Object {
      Write-Output "正在删除目录：$($_.FullName)"
      Remove-Item -Path $_.FullName -Force -Recurse
  }
 * 
  记得加 -Encoding UTF8


 * for /d /r . %d in (*newFolder*) do @if exist "%d" rd /s /q "%d"
 */