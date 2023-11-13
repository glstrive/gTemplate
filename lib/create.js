/*
 * @Author: gonglong
 * @Date: 2023-10-19 20:06:01
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-11-12 16:58:10
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved. 
 */
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
    if (fs.existsSync(fileName)) {
      return console.log("文件存在");
    }
    fs.writeFile(fileName, str, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("文件写入成功");
    });
  }
}

module.exports = Create;
