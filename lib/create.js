const fs = require("fs");
class Create {
  createFolder(folderName) {
    if (fs.existsSync(folderName)) {
      return console.log("文件存在");
    }
    fs.mkdir(folderName, (e) => {
      if (e) {
        console.log("目录创建成失败", e);
      }
    });
  }
  createFile(fileName, str) {
    fs.writeFile(fileName, str, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("文件写入成功");
    });
  }
}

module.exports = Create;
