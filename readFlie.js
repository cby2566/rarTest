const fs = require("fs");

let scName = ""
//文件属性
// fs.stat('./repFileName.js', (err, stats) => {
//     if (err) throw err;
//     console.log(`文件属性: ${JSON.stringify(stats)}`);
// });
//

async function print(path) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    console.log(dirent.name);
  }
}
print('./').catch(console.error);