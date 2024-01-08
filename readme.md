<!--
 * @Author: gonglong
 * @Date: 2024-01-08 15:23:25
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2024-01-08 16:16:45
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name}, All Rights Reserved. 
-->
### 快速开始

### 介绍

根据`apifox`或者自定义`columns`一键生成`ant`表格CRUD

#### 安装

```console
npm  install g-ant-temp --save-dev 
```

### 配置
在`package.json` 中配置运行命令:

```
{
    ...
    "script":{
        ...
        "startTemp": "gTemplate"
    }
}
```
执行脚本
```
npm  run startTemp
```
执行过后，如果本地没有基础配置模版页面，会自动生成配置页面`.gTemplate.js`文件，此文件为配置文件。如果本地有配置文件，则开始生成文件。

### API
```js
baseUrl: "",   //生成list edit目录前缀
fileName: "test",  //生成文件名
apiFoxApi: "",      //apifox导出地址
list:{          //list配置
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
    open:  true,  //是否生成
    baseUrl: "",  //生成utils目录前缀
    fileName: "test", //文件名
    exportFileFunction: null,   //导出函数
    customFunc: [],  //自定义写入处理函数   例：[函数1,函数2]
} 
```
###  apifox使用
使用`apifox`生成需要下载客户端，打开对应的接口，选择导出，然后点击打开URL按钮，在浏览器地址栏复制地址填入配置项的`apiFoxApi`中，继续填写其他配置项，最后，执行脚本即可生成。

### License
[MIT](http://opensource.org/licenses/MIT)
