const fs = require("fs");
const fsPromise = fs.promises;
const readline = require("readline");
const path = require("path");

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
      if (fileDirentObj.isDirectory()) {
        // 文件夹
        await acc(path.join(_url, fileDirentObj.name));
      } else {
        // 非目录
        callback(path.join(_url, fileDirentObj.name));
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
});
