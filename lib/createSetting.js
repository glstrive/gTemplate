/*
 * @Author: gonglong
 * @Date: 2023-10-17 14:43:57
 * @LastEditors: gonglong gongl@troy.cn
 * @LastEditTime: 2023-10-19 11:03:37
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved. 
 */

const fs = require('fs');   
class CreateSetting{
    constructor(){
        this._data= null
        this.readErr = null
        console.log('CreateSetting执行');
        this.start()
    }

    get data(){
        return this._data
    }

    set data(x){
        this._data = x
    }
    start() {
        this.read()
    }
    set readErr (x){
        this._err = x
    }
    get readErr(){
        return this._err
    }

    read(){
        try{
            const configContent = fs.readFileSync('.gTemplate.js', 'utf-8');  
            const config = eval(configContent);  
            // console.log(config);
            this.data= config;
        }catch(e){
            this.readErr = e
            console.log('文件不存在',e)
            this.write()
        }
    }
    write (){
        fs.writeFileSync('.gTemplate.js',this.createFileStream(),(err)=>{
            if(err){
                return   console.log(err)
               }
               console.log('文件写入成功');
        })
    }

    createFileStream(){
        const res = `
        module.exports = {
                /**
                 * 生成目录
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
                    api: "/sunwoda-park/parkInformation/page",
                    // list columns 剔除参数
                    pageExclude: ["size", "current", "pageSize", "parkId", "id"],
                    //删除api  
                    deleteUrl: "",
                    //导出api
                    exportUrl: ""
                },
                edit:{
                    // 提交地址
                    submit: "/sunwoda-park/parkInformation/submit"
                }
            }
        `
        return res
    }
}
module.exports = new CreateSetting();