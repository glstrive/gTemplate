/*
 * @Author: gonglong
 * @Date: 2023-10-17 14:43:57
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-11-19 17:01:02
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved.
 */

const fs = require("fs");

class CreateSetting {
  constructor() {
    this._data = null;
    this.readErr = null;
    console.log("CreateSetting执行");
    this.start();
  }

  get data() {
    return this._data;
  }

  set data(x) {
    this._data = x;
  }
  start() {
    this.read();
  }
  set readErr(x) {
    this._err = x;
  }
  get readErr() {
    return this._err;
  }

  read() {
    try {
      const configContent = fs.readFileSync(".gTemplate.js", "utf-8");
      const config = eval(configContent);
      // console.log(config);
      this.data = config;
    } catch (e) {
      this.readErr = e;
      console.log("文件不存在", e);
      this.write();
    }
  }
  write() {
    fs.writeFileSync(".gTemplate.js", this.createFileStream(), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("文件写入成功");
    });
  }

  createFileStream() {
    const res = `
        module.exports = {
                /**
                 * 生成list edit目录前缀
                 * **/
                baseUrl: "",
                /**
                 * 文件名
                 * **/
                fileName: "test",
                /**
                 * apifox导出地址
                 * **/
                apiFoxApi: "",
                /**
                 * list配置
                 * **/
                list:{
                    // 是否分页
                    isPage: true,
                    //list  列表请求地址
                    api: "",
                    // list columns 剔除参数
                    pageExclude: ["size", "current", "pageSize", "parkId", "id"],
                    //删除api  
                    deleteUrl: "",
                    // 开启 批量删除
                    batchDelete: false,
                    //导出api
                    exportUrl: "",
                    //多选    'checkbox'|'radio'
                    checkType: "",
                    // columns 依据ProTable 配置
                    columns: []
                },
                edit:{
                    // 提交地址
                    submitUrl: "",
                    // 自定义column传入
                    columns: []
                },
                // !!!!!工具函数会覆盖生成
                utils:{
                    /**
                     * 是否生成
                     * **/
                    open:  true,
                    /**
                     * 生成utils目录前缀
                     * **/
                    baseUrl: "",
                    /**
                     * 文件名
                     * **/
                    fileName: "test",
                    /**
                     * 导出函数
                     * **/
                    exportFileFunction: null,
                    /**
                     *  自定义写入处理函数   例：[函数1,函数2]
                     * **/
                    customFunc: []
                }
            }
        `;
    return res;
  }
}
module.exports = new CreateSetting();
